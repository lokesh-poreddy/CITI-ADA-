package in.udaansetu.platform.integrations;

/** Extension point for approved partner integrations. Never scrape or sync unapproved endpoints. */
public interface PartnerAdapter {
    String id();
    String displayName();
    String capability();
    IntegrationStatus status();
    String setupGuidance();
}
