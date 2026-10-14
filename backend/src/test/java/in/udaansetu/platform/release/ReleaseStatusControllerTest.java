package in.udaansetu.platform.release;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class ReleaseStatusControllerTest {
    @Test
    void prototypeIsNotReportedAsProductionReady() {
        ReleaseStatus status = new ReleaseStatusController("test").status();
        assertFalse(status.productionReady());
        assertEquals("HACKATHON_PROTOTYPE", status.releaseStage());
        assertTrue(status.releaseGates().stream().anyMatch(item -> item.contains("identity provider")));
    }
}
