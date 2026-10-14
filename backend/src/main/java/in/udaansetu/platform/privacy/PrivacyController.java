package in.udaansetu.platform.privacy;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/privacy")
public class PrivacyController {
    private final PrivacyService service;
    public PrivacyController(PrivacyService service) { this.service = service; }

    @GetMapping("/notice") public PrivacyNotice notice() { return service.notice(); }

    @GetMapping("/consents")
    public List<ConsentView> consents(@RequestHeader(value = "X-Actor-Key", required = false) String actorKey) {
        return service.listConsents(requireActor(actorKey));
    }

    @PutMapping("/consents")
    public ConsentView updateConsent(@RequestHeader(value = "X-Actor-Key", required = false) String actorKey,
            @Valid @RequestBody ConsentUpdateRequest request) {
        return service.updateConsent(requireActor(actorKey), request);
    }

    @DeleteMapping("/consents")
    public RevokeConsentResponse revokeAll(@RequestHeader(value = "X-Actor-Key", required = false) String actorKey) {
        return new RevokeConsentResponse(true, service.revokeAllConsents(requireActor(actorKey)),
                "Consent preferences were removed from the prototype in-memory ledger.");
    }

    @PostMapping("/data-rights-requests")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public DataRightsRequestView createRequest(@RequestHeader(value = "X-Actor-Key", required = false) String actorKey,
            @Valid @RequestBody DataRightsRequest request) {
        return service.createDataRightsRequest(requireActor(actorKey), request);
    }

    @GetMapping("/data-rights-requests")
    public List<DataRightsRequestView> listRequests(@RequestHeader(value = "X-Actor-Key", required = false) String actorKey) {
        return service.listDataRightsRequests(requireActor(actorKey));
    }

    private String requireActor(String key) {
        if (key == null || !key.matches("[A-Za-z0-9_-]{4,160}")) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "X-Actor-Key must be a 4–160 character prototype identifier.");
        }
        return key;
    }

    public record RevokeConsentResponse(boolean revoked, int removedPreferences, String note) {}
}
