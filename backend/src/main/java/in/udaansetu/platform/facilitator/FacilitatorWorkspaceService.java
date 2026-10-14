package in.udaansetu.platform.facilitator;

import in.udaansetu.platform.facilitator.FacilitatorDtos.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FacilitatorWorkspaceService {
    private final Map<String, Cohort> cohorts = new ConcurrentHashMap<>();
    private final Map<String, Referral> referrals = new ConcurrentHashMap<>();

    public List<Cohort> listCohorts(String ownerKey) {
        requireActor(ownerKey);
        return cohorts.values().stream().filter(c -> c.ownerKey().equals(ownerKey))
                .sorted(Comparator.comparing(Cohort::createdAt).reversed()).toList();
    }

    public Cohort createCohort(String ownerKey, CohortCreateRequest request) {
        requireActor(ownerKey);
        String name = clean(request.name());
        if (name.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cohort name is required.");
        Cohort cohort = new Cohort(id("cohort"), ownerKey, name, clean(request.region()), clean(request.purpose()),
                Instant.now(), List.of(), false);
        cohorts.put(cohort.id(), cohort);
        return cohort;
    }

    public Cohort addLearner(String ownerKey, String cohortId, CohortLearnerRequest request) {
        Cohort cohort = requireOwnedCohort(ownerKey, cohortId);
        boolean duplicate = cohort.learners().stream().anyMatch(l -> l.learnerKey().equals(request.learnerKey()));
        if (duplicate) throw new ResponseStatusException(HttpStatus.CONFLICT, "This learner is already linked to the cohort.");
        List<LearnerLink> members = new ArrayList<>(cohort.learners());
        members.add(new LearnerLink(request.learnerKey().trim(), clean(request.displayAlias()), true, Instant.now()));
        Cohort updated = new Cohort(cohort.id(), cohort.ownerKey(), cohort.name(), cohort.region(), cohort.purpose(), cohort.createdAt(), List.copyOf(members), cohort.demoRecord());
        cohorts.put(updated.id(), updated);
        return updated;
    }

    public Referral createReferral(String ownerKey, ReferralCreateRequest request) {
        Cohort cohort = requireOwnedCohort(ownerKey, request.cohortId());
        boolean linked = cohort.learners().stream().anyMatch(l -> l.learnerKey().equals(request.learnerKey()));
        if (!linked) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The learner must be linked to this cohort first.");
        Referral referral = new Referral(id("referral"), cohort.id(), request.learnerKey().trim(),
                clean(request.targetType()).toUpperCase(), clean(request.targetId()), clean(request.summary()),
                request.followUpDate(), "OPEN", ownerKey, Instant.now());
        referrals.put(referral.id(), referral);
        return referral;
    }

    public List<Referral> listReferrals(String ownerKey) {
        requireActor(ownerKey);
        return referrals.values().stream().filter(r -> r.createdBy().equals(ownerKey))
                .sorted(Comparator.comparing(Referral::createdAt).reversed()).toList();
    }

    private Cohort requireOwnedCohort(String ownerKey, String id) {
        requireActor(ownerKey);
        Cohort cohort = cohorts.get(id);
        if (cohort == null || !cohort.ownerKey().equals(ownerKey)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cohort not found.");
        }
        return cohort;
    }

    private static void requireActor(String actor) {
        if (actor == null || actor.isBlank() || actor.length() > 80)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid demo actor key is required.");
    }
    private static String clean(String value) { return value == null ? "" : value.trim(); }
    private static String id(String prefix) { return prefix + "-" + UUID.randomUUID(); }
}
