package in.udaansetu.platform.analytics;

/** A deliberately small, privacy-reviewed event vocabulary. Never add free-text payloads here. */
public enum MetricEventName {
    PROFILE_STARTED,
    PROFILE_COMPLETED,
    PATHWAY_VIEWED,
    OPPORTUNITY_OPENED,
    OPPORTUNITY_SAVED,
    APPLICATION_STARTED,
    APPLICATION_HANDED_OFF,
    FACILITATOR_REFERRAL_CREATED,
    LEARNING_MODULE_OPENED,
    OFFLINE_SYNC_SUCCEEDED,
    OFFLINE_SYNC_CONFLICT,
    ASSISTANT_NO_SUPPORTED_EVIDENCE,
    TEST_EVENT
}
