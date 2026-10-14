package in.udaansetu.platform.privacy;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * Prototype privacy ledger. Actor keys are digested before storage; no names or contacts are collected.
 * This does not replace authenticated identity, persistent data inventory, or production data-rights fulfillment.
 */
@Service
public class PrivacyService {
    private final Map<String, ConsentView> consents = new ConcurrentHashMap<>();
    private final Map<String, StoredRightsRequest> rightsRequests = new ConcurrentHashMap<>();

    public PrivacyNotice notice() {
        return new PrivacyNotice("2026-10-14-v1",
                List.of("Personalized guidance (prototype preference)", "Facilitator sharing (prototype preference)",
                        "Optional aggregate analytics"),
                List.of("Names", "Phone numbers", "Email addresses", "Free-text questions", "Learner-level analytics history"),
                List.of("Consent records and data-rights requests are held in memory and reset on restart.",
                        "Actor headers are prototype identifiers, not authentication.",
                        "End-to-end export/erasure across all product data stores is not implemented in this build."),
                "Optional analytics is opt-in in this prototype. Declining analytics must not block core learning or opportunity discovery.");
    }

    public List<ConsentView> listConsents(String actorKey) {
        String digest = digest(actorKey);
        List<ConsentView> result = new ArrayList<>();
        consents.forEach((key, value) -> {
            if (key.startsWith(digest + ":")) result.add(value);
        });
        result.sort(Comparator.comparing(view -> view.scope().name()));
        return List.copyOf(result);
    }

    public ConsentView updateConsent(String actorKey, ConsentUpdateRequest request) {
        String digest = digest(actorKey);
        ConsentView view = new ConsentView(request.scope(), request.granted(), request.policyVersion(), Instant.now());
        consents.put(digest + ":" + request.scope().name(), view);
        return view;
    }

    public boolean hasConsent(String actorKey, ConsentScope scope) {
        String key = digest(actorKey) + ":" + scope.name();
        ConsentView view = consents.get(key);
        return view != null && view.granted();
    }

    public int revokeAllConsents(String actorKey) {
        String prefix = digest(actorKey) + ":";
        int before = consents.size();
        consents.keySet().removeIf(key -> key.startsWith(prefix));
        return before - consents.size();
    }

    public DataRightsRequestView createDataRightsRequest(String actorKey, DataRightsRequest request) {
        String id = "dr-" + UUID.randomUUID();
        StoredRightsRequest stored = new StoredRightsRequest(digest(actorKey), request.requestType(), Instant.now());
        rightsRequests.put(id, stored);
        return toView(id, stored);
    }

    public List<DataRightsRequestView> listDataRightsRequests(String actorKey) {
        String digest = digest(actorKey);
        return rightsRequests.entrySet().stream()
                .filter(entry -> entry.getValue().actorDigest().equals(digest))
                .map(entry -> toView(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(DataRightsRequestView::createdAt).reversed())
                .toList();
    }

    private DataRightsRequestView toView(String id, StoredRightsRequest request) {
        return new DataRightsRequestView(id, request.type(), "PENDING_MANUAL_REVIEW", request.createdAt(),
                "This prototype records the request only. It has not exported or erased data; verified manual fulfillment is required.");
    }

    private static String digest(String actorKey) {
        if (actorKey == null || actorKey.isBlank() || actorKey.length() > 160) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "A valid prototype actor key is required.");
        }
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(actorKey.trim().getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException impossible) {
            throw new IllegalStateException("SHA-256 is required by the Java runtime.", impossible);
        }
    }

    private record StoredRightsRequest(String actorDigest, DataRightsRequestType type, Instant createdAt) {}
}
