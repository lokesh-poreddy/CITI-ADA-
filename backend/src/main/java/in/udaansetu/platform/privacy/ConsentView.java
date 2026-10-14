package in.udaansetu.platform.privacy;

import java.time.Instant;

public record ConsentView(ConsentScope scope, boolean granted, String policyVersion, Instant updatedAt) {}
