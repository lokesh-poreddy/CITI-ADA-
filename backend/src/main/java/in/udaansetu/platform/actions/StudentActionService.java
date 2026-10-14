package in.udaansetu.platform.actions;

import in.udaansetu.platform.opportunity.OpportunityCatalogue;
import in.udaansetu.platform.opportunity.OpportunityNotFoundException;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class StudentActionService {
    private final OpportunityCatalogue catalogue;
    private final Map<String, StudentOpportunityAction> latestByLearnerAndOpportunity = new ConcurrentHashMap<>();
    private final Map<String, StudentOpportunityAction> byEventId = new ConcurrentHashMap<>();

    public StudentActionService(OpportunityCatalogue catalogue) { this.catalogue = catalogue; }

    public List<StudentOpportunityAction> list(String learnerKey) {
        validateLearnerKey(learnerKey);
        return latestByLearnerAndOpportunity.entrySet().stream()
                .filter(e -> e.getKey().startsWith(learnerKey + "::"))
                .map(Map.Entry::getValue)
                .sorted(Comparator.comparing(StudentOpportunityAction::updatedAt).reversed())
                .toList();
    }

    public StudentOpportunityAction apply(String learnerKey, ActionWriteRequest request) {
        validateLearnerKey(learnerKey);
        if (!catalogue.exists(request.opportunityId())) throw new OpportunityNotFoundException(request.opportunityId());
        if (request.status() == null) throw new IllegalArgumentException("Action status is required.");
        String eventKey = learnerKey + "::" + request.clientEventId();
        StudentOpportunityAction duplicate = byEventId.get(eventKey);
        if (duplicate != null) return duplicate;
        String itemKey = learnerKey + "::" + request.opportunityId();
        Instant now = Instant.now();
        StudentOpportunityAction previous = latestByLearnerAndOpportunity.get(itemKey);
        StudentOpportunityAction updated = new StudentOpportunityAction(
                previous == null ? UUID.randomUUID().toString() : previous.id(), request.clientEventId(), request.opportunityId(), request.status(),
                previous == null ? now : previous.createdAt(), now, "SYNCED");
        byEventId.put(eventKey, updated);
        latestByLearnerAndOpportunity.put(itemKey, updated);
        return updated;
    }

    public List<StudentOpportunityAction> sync(String learnerKey, ActionSyncRequest request) {
        validateLearnerKey(learnerKey);
        return request.actions().stream().map(item -> apply(learnerKey, item)).toList();
    }

    private void validateLearnerKey(String key) {
        if (key == null || !key.matches("[A-Za-z0-9_-]{12,80}")) {
            throw new IllegalArgumentException("A prototype learner key between 12 and 80 safe characters is required. This key is not authentication.");
        }
    }
}
