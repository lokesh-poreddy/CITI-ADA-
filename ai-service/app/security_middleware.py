"""ASGI security and request-safety controls for the AI gateway.

These controls complement—not replace—reverse-proxy limits and production authentication.
The limiter intentionally keys on ASGI peer IP and does not trust forwarded headers.
"""
from __future__ import annotations
import json
import re
import time
import uuid
from collections import defaultdict, deque
from typing import Deque

_SAFE_REQUEST_ID = re.compile(r"^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$")
_MAX_BODY_BYTES = 1_048_576


class SecurityControlsMiddleware:
    def __init__(self, app, limit_per_minute: int = 30):
        self.app = app
        self.limit_per_minute = limit_per_minute
        self._windows: dict[str, Deque[float]] = defaultdict(deque)

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            await self.app(scope, receive, send)
            return

        headers = {key.lower(): value for key, value in scope.get("headers", [])}
        candidate_id = headers.get(b"x-request-id", b"").decode("latin-1", errors="ignore")
        request_id = candidate_id if _SAFE_REQUEST_ID.fullmatch(candidate_id) else str(uuid.uuid4())
        path = scope.get("path", "")
        method = scope.get("method", "GET").upper()
        content_length = headers.get(b"content-length", b"0")
        try:
            declared_length = int(content_length)
        except ValueError:
            declared_length = _MAX_BODY_BYTES + 1

        if path.startswith("/api/") and declared_length > _MAX_BODY_BYTES:
            await self._respond(send, 413, {"detail": "Request body exceeds the 1 MiB prototype limit."}, request_id)
            return

        if method == "POST" and path == "/api/v1/assistant/grounded-answer":
            peer = scope.get("client") or ("unknown", 0)
            key = f"{peer[0]}|{path}"
            now = time.monotonic()
            window = self._windows[key]
            while window and now - window[0] >= 60:
                window.popleft()
            if len(window) >= self.limit_per_minute:
                await self._respond(send, 429, {"detail": "Assistant request rate is temporarily limited."}, request_id,
                                    extra_headers=[(b"retry-after", b"60")])
                return
            window.append(now)
            # Bound process memory if a local demo receives many peer addresses.
            if len(self._windows) > 4096:
                stale_before = now - 120
                for old_key in list(self._windows.keys()):
                    old = self._windows[old_key]
                    while old and now - old[0] >= 60:
                        old.popleft()
                    if not old or old[0] < stale_before:
                        self._windows.pop(old_key, None)

        async def secure_send(message):
            if message.get("type") == "http.response.start":
                existing = list(message.get("headers", []))
                security_headers = [
                    (b"x-content-type-options", b"nosniff"),
                    (b"x-frame-options", b"DENY"),
                    (b"referrer-policy", b"strict-origin-when-cross-origin"),
                    (b"permissions-policy", b"camera=(), geolocation=(), microphone=(self), usb=()"),
                    (b"content-security-policy", b"default-src 'none'; frame-ancestors 'none'; base-uri 'none'"),
                    (b"x-request-id", request_id.encode("ascii")),
                    (b"cache-control", b"no-store"),
                ]
                existing_names = {key.lower() for key, _ in existing}
                existing.extend((key, value) for key, value in security_headers if key not in existing_names)
                message["headers"] = existing
            await send(message)

        effective_receive = receive
        if path.startswith("/api/") and method in {"POST", "PUT", "PATCH", "DELETE"}:
            # Buffer a bounded API body and replay it downstream. This also protects chunked requests
            # where Content-Length is absent; all current gateway write bodies are small JSON payloads.
            messages = []
            actual_size = 0
            while True:
                message = await receive()
                messages.append(message)
                if message.get("type") == "http.disconnect":
                    break
                if message.get("type") == "http.request":
                    actual_size += len(message.get("body", b""))
                    if actual_size > _MAX_BODY_BYTES:
                        await self._respond(send, 413, {"detail": "Request body exceeds the 1 MiB prototype limit."}, request_id)
                        return
                    if not message.get("more_body", False):
                        break

            async def replay_receive():
                if messages:
                    return messages.pop(0)
                return await receive()

            effective_receive = replay_receive

        await self.app(scope, effective_receive, secure_send)

    async def _respond(self, send, status: int, payload: dict, request_id: str, extra_headers=None):
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        headers = [
            (b"content-type", b"application/json"),
            (b"content-length", str(len(body)).encode("ascii")),
            (b"cache-control", b"no-store"),
            (b"x-content-type-options", b"nosniff"),
            (b"x-frame-options", b"DENY"),
            (b"referrer-policy", b"strict-origin-when-cross-origin"),
            (b"permissions-policy", b"camera=(), geolocation=(), microphone=(self), usb=()"),
            (b"content-security-policy", b"default-src 'none'; frame-ancestors 'none'; base-uri 'none'"),
            (b"x-request-id", request_id.encode("ascii")),
        ]
        if extra_headers:
            headers.extend(extra_headers)
        await send({"type": "http.response.start", "status": status, "headers": headers})
        await send({"type": "http.response.body", "body": body})
