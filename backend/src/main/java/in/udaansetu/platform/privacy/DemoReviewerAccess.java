package in.udaansetu.platform.privacy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/** Prototype-only reviewer gate. Production must replace this with authenticated role authorization. */
@Component
public class DemoReviewerAccess {
    private final String token;

    public DemoReviewerAccess(@Value("${app.reviewer-token:}") String token) {
        this.token = token == null ? "" : token.trim();
    }

    public void requireConfiguredReviewer(String suppliedToken) {
        if (token.isBlank() || token.length() < 24 || suppliedToken == null || !constantTimeEquals(token, suppliedToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Reviewer reporting is disabled until a non-placeholder APP_REVIEWER_TOKEN is configured.");
        }
    }

    private boolean constantTimeEquals(String expected, String actual) {
        return java.security.MessageDigest.isEqual(expected.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                actual.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}
