package in.udaansetu.platform.release;

import java.util.List;

public record ReleaseStatus(
        String product,
        String version,
        String releaseStage,
        boolean productionReady,
        String persistenceMode,
        String identityMode,
        List<String> disabledExternalCapabilities,
        List<String> releaseGates) {}
