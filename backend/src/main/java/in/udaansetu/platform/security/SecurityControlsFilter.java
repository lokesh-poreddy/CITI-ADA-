package in.udaansetu.platform.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Prototype defense-in-depth: security headers, request correlation, a declared-body ceiling and coarse abuse throttling.
 * Configure equivalent or stronger controls at the production edge/load balancer as well.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
public class SecurityControlsFilter extends OncePerRequestFilter {
    private static final long MAX_BODY_BYTES = 1_048_576L;
    private static final Pattern SAFE_REQUEST_ID = Pattern.compile("[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[1-8][a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}");
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestId = safeRequestId(request.getHeader("X-Request-Id"));
        MDC.put("requestId", requestId);
        try {
            applyHeaders(response, requestId);
            // Apply the coarse rate limit before reading request bodies, so rejected traffic costs less work.
            if (!"OPTIONS".equalsIgnoreCase(request.getMethod()) && shouldThrottle(request)) {
                String client = request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
                String key = request.getRequestURI() + "|" + client;
                long window = Instant.now().getEpochSecond() / 60;
                Bucket bucket = buckets.compute(key, (ignored, current) -> current == null || current.window != window
                        ? new Bucket(window) : current);
                if (bucket.count.incrementAndGet() > requestsPerMinute(request.getRequestURI())) {
                    response.setHeader(HttpHeaders.RETRY_AFTER, "60");
                    response.sendError(429, "Request rate is temporarily limited. Please retry shortly.");
                    return;
                }
                // Avoid an unbounded key registry in a long-lived prototype process.
                if (buckets.size() > 10_000) buckets.entrySet().removeIf(entry -> entry.getValue().window < window - 2);
            }

            HttpServletRequest effectiveRequest = request;
            if (request.getRequestURI().startsWith("/api/") && hasRequestBody(request)) {
                if (contentLengthExceedsLimit(request)) {
                    response.sendError(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE, "Request body exceeds the 1 MiB prototype limit.");
                    return;
                }
                // Bound even chunked requests without a Content-Length header, then replay the limited body downstream.
                byte[] body = request.getInputStream().readNBytes((int) MAX_BODY_BYTES + 1);
                if (body.length > MAX_BODY_BYTES) {
                    response.sendError(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE, "Request body exceeds the 1 MiB prototype limit.");
                    return;
                }
                effectiveRequest = new CachedBodyHttpServletRequest(request, body);
            }
            chain.doFilter(effectiveRequest, response);
        } finally {
            MDC.remove("requestId");
        }
    }

    private boolean contentLengthExceedsLimit(HttpServletRequest request) {
        return request.getContentLengthLong() > MAX_BODY_BYTES;
    }

    private boolean hasRequestBody(HttpServletRequest request) {
        String method = request.getMethod();
        return "POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)
                || "PATCH".equalsIgnoreCase(method) || "DELETE".equalsIgnoreCase(method);
    }

    private boolean shouldThrottle(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) return false;
        String path = request.getRequestURI();
        return path.equals("/api/v1/analytics/events")
                || path.equals("/api/v1/assistant/grounded-answer")
                || path.equals("/api/v1/privacy/data-rights-requests");
    }

    private int requestsPerMinute(String path) {
        return path.equals("/api/v1/assistant/grounded-answer") ? 30 : 90;
    }

    private String safeRequestId(String candidate) {
        // Accept only UUID-like trace IDs so the value cannot be used as an arbitrary log field.
        return candidate != null && SAFE_REQUEST_ID.matcher(candidate).matches()
                ? candidate : java.util.UUID.randomUUID().toString();
    }

    private void applyHeaders(HttpServletResponse response, String requestId) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=(self), usb=()");
        response.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
        response.setHeader("X-Request-Id", requestId);
        response.setHeader("Cache-Control", "no-store");
    }

    private static final class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {
        private final byte[] body;
        private ServletInputStream inputStream;
        private BufferedReader reader;

        private CachedBodyHttpServletRequest(HttpServletRequest request, byte[] body) {
            super(request);
            this.body = body;
        }

        @Override public int getContentLength() { return body.length; }
        @Override public long getContentLengthLong() { return body.length; }

        @Override
        public ServletInputStream getInputStream() {
            if (inputStream == null) {
                ByteArrayInputStream source = new ByteArrayInputStream(body);
                inputStream = new ServletInputStream() {
                    @Override public int read() { return source.read(); }
                    @Override public boolean isFinished() { return source.available() == 0; }
                    @Override public boolean isReady() { return true; }
                    @Override public void setReadListener(ReadListener listener) {
                        try {
                            if (!isFinished()) listener.onDataAvailable();
                            if (isFinished()) listener.onAllDataRead();
                        } catch (IOException error) {
                            listener.onError(error);
                        }
                    }
                };
            }
            return inputStream;
        }

        @Override
        public BufferedReader getReader() throws IOException {
            if (reader == null) {
                String encoding = getCharacterEncoding();
                reader = new BufferedReader(new InputStreamReader(getInputStream(),
                        encoding == null ? StandardCharsets.UTF_8 : java.nio.charset.Charset.forName(encoding)));
            }
            return reader;
        }
    }

    private static final class Bucket {
        private final long window;
        private final AtomicInteger count = new AtomicInteger();
        private Bucket(long window) { this.window = window; }
    }
}
