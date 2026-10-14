package in.udaansetu.platform.opportunity;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Component;

/** Conservative rules engine: it never guesses rules not present in reviewed source data. */
@Component
public class OpportunityEligibilityEngine {
    public EligibilityCheckResponse check(Opportunity opportunity, EligibilityCheckRequest input) {
        if (!opportunity.eligibilityRulesConfigured()) {
            return new EligibilityCheckResponse(opportunity.id(), "NEEDS_REVIEW",
                    "This listing does not contain a complete, reviewed eligibility rule set. Open the official source before applying.",
                    List.of(), List.of("Official eligibility criteria have not been encoded and reviewed"),
                    "This result is guidance only. The official provider decides eligibility.");
        }
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        boolean failed = false;
        if (!opportunity.eligibleEducationLevels().isEmpty()) {
            if (input.educationLevel() == null || input.educationLevel().isBlank()) missing.add("Current education level");
            else if (opportunity.eligibleEducationLevels().stream().noneMatch(v -> v.equalsIgnoreCase(input.educationLevel().trim()))) failed = true;
            else matched.add("Education level matches the reviewed rule");
        }
        if (!opportunity.eligibleStates().isEmpty()) {
            if (input.state() == null || input.state().isBlank()) missing.add("State or union territory");
            else if (opportunity.eligibleStates().stream().noneMatch(v -> v.equalsIgnoreCase(input.state().trim()))) failed = true;
            else matched.add("State matches the reviewed rule");
        }
        if (opportunity.minAge() != null || opportunity.maxAge() != null) {
            if (input.age() == null) missing.add("Age");
            else if ((opportunity.minAge() != null && input.age() < opportunity.minAge()) || (opportunity.maxAge() != null && input.age() > opportunity.maxAge())) failed = true;
            else matched.add("Age is within the reviewed range");
        }
        if (opportunity.maxAnnualFamilyIncomeInr() != null) {
            if (input.annualFamilyIncomeInr() == null) missing.add("Annual family income");
            else if (input.annualFamilyIncomeInr() > opportunity.maxAnnualFamilyIncomeInr()) failed = true;
            else matched.add("Income is within the reviewed limit");
        }
        if (!missing.isEmpty()) {
            return new EligibilityCheckResponse(opportunity.id(), "NEEDS_MORE_INFORMATION",
                    "Some details are needed to check the configured rules. Only provide information you are comfortable sharing.",
                    matched, missing, "This result is guidance only. Confirm requirements with the official provider.");
        }
        if (failed) {
            return new EligibilityCheckResponse(opportunity.id(), "POSSIBLE_MISMATCH",
                    "One or more supplied details do not match the currently configured rules. Verify the official criteria before deciding not to apply.",
                    matched, List.of(), "This is not an official rejection and must not be used as the sole reason to withhold an opportunity.");
        }
        return new EligibilityCheckResponse(opportunity.id(), "RULES_MATCH",
                "The supplied details match the configured rules. This is not confirmation of eligibility or selection.",
                matched, List.of(), "Only the official provider can confirm eligibility.");
    }
}
