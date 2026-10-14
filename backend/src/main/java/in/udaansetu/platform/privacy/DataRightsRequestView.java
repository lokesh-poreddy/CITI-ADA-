package in.udaansetu.platform.privacy;

import java.time.Instant;

public record DataRightsRequestView(String requestId, DataRightsRequestType requestType,
        String status, Instant createdAt, String notice) {}
