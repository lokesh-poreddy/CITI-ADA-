package in.udaansetu.platform.opportunity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class OpportunityService {
    private final OpportunityCatalogue catalogue;
    private final OpportunityEligibilityEngine eligibilityEngine;

    public OpportunityService(OpportunityCatalogue catalogue, OpportunityEligibilityEngine eligibilityEngine) {
        this.catalogue = catalogue;
        this.eligibilityEngine = eligibilityEngine;
    }

    public OpportunitySearchResponse search(String query, OpportunityType type, String state, String language, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(50, Math.max(1, size));
        List<Opportunity> all = catalogue.search(query, type, state, language);
        long offset = (long) safePage * safeSize;
        int from = (int) Math.min(all.size(), offset);
        int to = Math.min(all.size(), from + safeSize);
        return new OpportunitySearchResponse(all.subList(from, to), all.size(), safePage, safeSize, Instant.now(),
                "Catalogue includes official portal references and a limited reviewed sample. Verify current criteria, deadlines and availability on the linked official source.");
    }

    public Opportunity detail(String id) {
        Opportunity opportunity = catalogue.findById(id).orElseThrow(() -> new OpportunityNotFoundException(id));
        if (opportunity.deadline() != null && opportunity.deadline().isBefore(LocalDate.now()) && opportunity.listingStatus() == ListingStatus.PUBLISHED) {
            catalogue.publish(new Opportunity(opportunity.id(), opportunity.title(), opportunity.summary(), opportunity.type(), opportunity.provider(),
                    opportunity.locationLabel(), opportunity.languageCodes(), opportunity.tags(), opportunity.sourceName(), opportunity.sourceUrl(),
                    opportunity.applicationUrl(), opportunity.sourceTrust(), ListingStatus.EXPIRED, opportunity.lastVerifiedAt(), opportunity.opensOn(),
                    opportunity.deadline(), opportunity.eligibleEducationLevels(), opportunity.eligibleStates(), opportunity.minAge(), opportunity.maxAge(),
                    opportunity.maxAnnualFamilyIncomeInr(), opportunity.eligibilityRulesConfigured(), opportunity.demoOnly(), opportunity.requiredDocuments(), opportunity.nextStep()));
            return catalogue.findById(id).orElseThrow(() -> new OpportunityNotFoundException(id));
        }
        return opportunity;
    }

    public EligibilityCheckResponse checkEligibility(String id, EligibilityCheckRequest request) {
        return eligibilityEngine.check(detail(id), request);
    }
}
