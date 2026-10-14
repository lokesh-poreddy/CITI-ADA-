package in.udaansetu.platform.integrations;

public record IntegrationDescriptor(String id, String displayName, String capability, IntegrationStatus status,
        String setupGuidance, boolean externalNetworkCallEnabled) {}
