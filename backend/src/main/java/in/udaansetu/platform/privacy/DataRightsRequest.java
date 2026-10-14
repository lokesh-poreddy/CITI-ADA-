package in.udaansetu.platform.privacy;

import jakarta.validation.constraints.NotNull;

public record DataRightsRequest(@NotNull DataRightsRequestType requestType) {}
