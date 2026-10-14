package in.udaansetu.platform.release;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "app.reviewer-token=unit-test-reviewer-token-with-at-least-24-chars")
@AutoConfigureMockMvc
class PhaseReleaseIntegrationTest {
    @Autowired private MockMvc mvc;

    @Test
    void analyticsStoresOnlyCountersAndSummaryRequiresConfiguredReviewer() throws Exception {
        mvc.perform(put("/api/v1/privacy/consents").header("X-Actor-Key", "actor-analytics-0001")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"scope\":\"OPTIONAL_ANALYTICS\",\"granted\":true,\"policyVersion\":\"policy-test-v1\"}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/v1/analytics/events").header("X-Actor-Key", "actor-analytics-0001")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"eventName\":\"TEST_EVENT\",\"actorRole\":\"ANONYMOUS\",\"connectivity\":\"ONLINE\",\"language\":\"en\"}"))
                .andExpect(status().isAccepted()).andExpect(jsonPath("$.aggregateOnly").value(true));
        mvc.perform(get("/api/v1/analytics/summary"))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/analytics/summary").header("X-Reviewer-Token", "unit-test-reviewer-token-with-at-least-24-chars"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalEvents").value(greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.byEvent.TEST_EVENT").value(greaterThanOrEqualTo(1)));
    }

    @Test
    void analyticsEndpointRefusesEventsUnlessOptionalAnalyticsConsentExists() throws Exception {
        mvc.perform(post("/api/v1/analytics/events").header("X-Actor-Key", "actor-no-consent-002")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"eventName\":\"TEST_EVENT\",\"actorRole\":\"ANONYMOUS\",\"connectivity\":\"ONLINE\",\"language\":\"en\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void privacyAndReleaseEndpointsDisclosePrototypeBoundaries() throws Exception {
        mvc.perform(get("/api/v1/privacy/notice"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.policyVersion").exists())
                .andExpect(jsonPath("$.prototypeLimitations").isArray());
        mvc.perform(get("/api/v1/release/status"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.productionReady").value(false))
                .andExpect(jsonPath("$.releaseStage").value("HACKATHON_PROTOTYPE"));
    }

    @Test
    void consentCanBeSavedAndRevokedForPrototypeActor() throws Exception {
        mvc.perform(put("/api/v1/privacy/consents").header("X-Actor-Key", "actor-test-0001")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"scope\":\"OPTIONAL_ANALYTICS\",\"granted\":true,\"policyVersion\":\"policy-test-v1\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.granted").value(true));
        mvc.perform(get("/api/v1/privacy/consents").header("X-Actor-Key", "actor-test-0001"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].scope").value("OPTIONAL_ANALYTICS"));
        mvc.perform(delete("/api/v1/privacy/consents").header("X-Actor-Key", "actor-test-0001"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.revoked").value(true));
    }

    @Test
    void allApiResponsesCarryBasicSecurityHeadersAndRequestCorrelation() throws Exception {
        mvc.perform(get("/api/v1/release/status").header("X-Request-Id", "b8b73b64-2d46-4f86-8f31-9b64d2fdb9ab"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().string("X-Frame-Options", "DENY"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().string("X-Request-Id", "b8b73b64-2d46-4f86-8f31-9b64d2fdb9ab"));
    }
}
