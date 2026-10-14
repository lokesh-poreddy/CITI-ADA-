package in.udaansetu.platform.ecosystem;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest @AutoConfigureMockMvc
class EcosystemApiTest {
    @Autowired MockMvc mvc;
    @Test void integrationsAreTransparentAndDoNotClaimExternalCalls() throws Exception {
        mvc.perform(get("/api/v1/partners/integrations")).andExpect(status().isOk()).andExpect(jsonPath("$",hasSize(5))).andExpect(jsonPath("$[?(@.id=='BHASHINI')].externalNetworkCallEnabled").value(org.hamcrest.Matchers.contains(false)));
    }
    @Test void publishedModulesCanBeDiscovered() throws Exception {
        mvc.perform(get("/api/v1/learning-modules")).andExpect(status().isOk()).andExpect(jsonPath("$[0].status").value("PUBLISHED"));
    }
    @Test void mentorConnectionRequiresSafeguardingConfirmations() throws Exception {
        String payload="""
          {"learnerAlias":"Learner A","purpose":"Explore learning routes","facilitatorKey":"facilitator-demo","consentConfirmed":true,"facilitatorMediated":false,"guardianOrInstitutionApprovalConfirmed":true}
          """;
        mvc.perform(post("/api/v1/mentors/mentor-demo-design/connection-requests").contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isBadRequest());
    }
    @Test void paidModuleWithoutPositivePriceIsRejected() throws Exception {
        String payload="""
          {"title":"Demo module","summary":"A short description","audience":"Secondary learners","language":"en","accessMode":"PAID","priceInr":0,"lessons":[{"title":"Lesson 1","summary":"First","resourceUrl":"","estimatedMinutes":10}]}
          """;
        mvc.perform(post("/api/v1/learning-modules").header("X-Actor-Key","facilitator-demo").contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isBadRequest());
    }
    @Test void integrationsAndSustainabilityOverviewAreAvailable() throws Exception {
        mvc.perform(get("/api/v1/sustainability/overview")).andExpect(status().isOk()).andExpect(jsonPath("$.models",hasSize(4))).andExpect(jsonPath("$.paymentStatus").value(org.hamcrest.Matchers.containsString("No payment processor")));
    }

    @Test void facilitatorCannotLinkLearnerWithoutConsentRecord() throws Exception {
        String payload="""
          {"learnerKey":"learner-demo-1","displayAlias":"Learner One","consentRecorded":false}
          """;
        mvc.perform(post("/api/v1/facilitator/cohorts/cohort-not-real/learners").header("X-Actor-Key","facilitator-demo").contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isBadRequest());
    }

    @Test void reviewerQueuesRejectTheDefaultLocalPlaceholderToken() throws Exception {
        mvc.perform(get("/api/v1/mentors/review-queue").header("X-Reviewer-Token","local-review-only-change-me")).andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/partner-listings/review-queue").header("X-Reviewer-Token","local-review-only-change-me")).andExpect(status().isForbidden());
    }
}
