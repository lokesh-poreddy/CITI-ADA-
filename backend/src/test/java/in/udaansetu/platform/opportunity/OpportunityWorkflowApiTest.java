package in.udaansetu.platform.opportunity;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest(properties = "app.reviewer-token=unit-test-reviewer-token-with-at-least-24-chars")
@AutoConfigureMockMvc
class OpportunityWorkflowApiTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void catalogueExposesSourceLinkedRecordsAndHonestDataNotice() throws Exception {
        mockMvc.perform(get("/api/v1/opportunities").param("q", "nsp-").param("size", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(2))
                .andExpect(jsonPath("$.items[0].sourceUrl").exists())
                .andExpect(jsonPath("$.dataNotice").value(org.hamcrest.Matchers.containsString("Verify current")));
    }

    @Test
    void scholarshipDiscoveryReferenceHasNoInventedDeadline() throws Exception {
        mockMvc.perform(get("/api/v1/opportunities").param("q", "scholarship discovery"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].id").value("nsp-scholarship-discovery"))
                .andExpect(jsonPath("$.items[0].deadline").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$.items[0].listingStatus").value("REFERENCE_ONLY"));
    }

    @Test
    void unconfiguredEligibilityRulesReturnReviewInsteadOfGuessing() throws Exception {
        mockMvc.perform(post("/api/v1/opportunities/nsp-pm-usp-csss-renewal-2026/eligibility-check")
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("NEEDS_REVIEW"))
                .andExpect(jsonPath("$.missingInformation[0]").value(org.hamcrest.Matchers.containsString("criteria")));
    }

    @Test
    void studentActionWritesAreIdempotentByClientEventId() throws Exception {
        String learnerKey = "anon-test-learner-123456";
        String eventId = "event-test-" + UUID.randomUUID().toString().replace("-", "");
        String body = "{\"clientEventId\":\"" + eventId + "\",\"opportunityId\":\"swayam-course-explorer\",\"status\":\"SAVED\"}";
        MvcResult first = mockMvc.perform(post("/api/v1/student/opportunity-actions")
                        .header("X-Learner-Key", learnerKey).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk()).andExpect(jsonPath("$.syncStatus").value("SYNCED")).andReturn();
        MvcResult second = mockMvc.perform(post("/api/v1/student/opportunity-actions")
                        .header("X-Learner-Key", learnerKey).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk()).andReturn();
        JsonNode firstJson = objectMapper.readTree(first.getResponse().getContentAsString());
        JsonNode secondJson = objectMapper.readTree(second.getResponse().getContentAsString());
        org.junit.jupiter.api.Assertions.assertEquals(firstJson.get("id").asText(), secondJson.get("id").asText());
        mockMvc.perform(get("/api/v1/student/opportunity-actions").header("X-Learner-Key", learnerKey))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].opportunityId").value("swayam-course-explorer"));
    }

    @Test
    void ingestionMustBeReviewedBeforeTheRecordIsPublished() throws Exception {
        String id = "review-test-" + UUID.randomUUID().toString().replace("-", "");
        String body = """
                {"records":[{"id":"%s","title":"Reviewed community course","summary":"A test listing for the review workflow.","type":"COURSE","provider":"Example provider","locationLabel":"All India","sourceName":"SWAYAM","sourceUrl":"https://swayam.gov.in/search_courses","applicationUrl":"https://swayam.gov.in/search_courses","languageCodes":["en"],"tags":["course"],"eligibleEducationLevels":[],"eligibleStates":[],"eligibilityRulesConfigured":false,"requiredDocuments":[],"applicationInstruction":"Check official details."}]}
                """.formatted(id);
        MvcResult preview = mockMvc.perform(post("/api/v1/opportunity-ingestion/preview")
                        .header("X-Reviewer-Token", "unit-test-reviewer-token-with-at-least-24-chars")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated()).andExpect(jsonPath("$[0].reviewStatus").value("PENDING")).andReturn();
        String reviewId = objectMapper.readTree(preview.getResponse().getContentAsString()).get(0).get("reviewId").asText();
        mockMvc.perform(get("/api/v1/opportunities").param("q", id))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(0));
        mockMvc.perform(post("/api/v1/opportunity-ingestion/review-queue/{id}/decision", reviewId)
                        .header("X-Reviewer-Token", "unit-test-reviewer-token-with-at-least-24-chars")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"approved\":true,\"note\":\"Reviewed source URL and record fields\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.reviewStatus").value("APPROVED"));
        mockMvc.perform(get("/api/v1/opportunities").param("q", id))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1));
    }
}
