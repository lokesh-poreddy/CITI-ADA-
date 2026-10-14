package in.udaansetu.platform.privacy;

import java.util.List;

public record PrivacyNotice(
        String policyVersion,
        List<String> purposes,
        List<String> notCollectedByAggregateAnalytics,
        List<String> prototypeLimitations,
        String userChoiceNote) {}
