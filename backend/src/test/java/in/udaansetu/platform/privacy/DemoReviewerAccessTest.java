package in.udaansetu.platform.privacy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class DemoReviewerAccessTest {
    private static final String TOKEN = "unit-test-reviewer-token-with-at-least-24-chars";

    @Test
    void configuredLongTokenIsAccepted() {
        new DemoReviewerAccess(TOKEN).requireConfiguredReviewer(TOKEN);
    }

    @Test
    void blankShortAndMismatchedTokensAreRejected() {
        assertEquals(403, assertThrows(ResponseStatusException.class,
                () -> new DemoReviewerAccess("").requireConfiguredReviewer(TOKEN)).getStatusCode().value());
        assertEquals(403, assertThrows(ResponseStatusException.class,
                () -> new DemoReviewerAccess("short").requireConfiguredReviewer("short")).getStatusCode().value());
        assertEquals(403, assertThrows(ResponseStatusException.class,
                () -> new DemoReviewerAccess(TOKEN).requireConfiguredReviewer("not-the-configured-token")).getStatusCode().value());
    }
}
