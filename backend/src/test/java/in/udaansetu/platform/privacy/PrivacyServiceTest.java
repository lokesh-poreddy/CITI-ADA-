package in.udaansetu.platform.privacy;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class PrivacyServiceTest {
    @Test
    void consentRecordsAreReturnedWithoutTheActorKey() {
        PrivacyService service = new PrivacyService();
        String actor = "learner-demo-47921";
        ConsentView saved = service.updateConsent(actor,
                new ConsentUpdateRequest(ConsentScope.OPTIONAL_ANALYTICS, true, "policy-test-v1"));
        assertTrue(saved.granted());
        assertEquals(1, service.listConsents(actor).size());
        assertFalse(service.listConsents(actor).toString().contains(actor));
        assertEquals(0, service.listConsents("somebody-else").size());
    }

    @Test
    void erasureRequestIsNotMisrepresentedAsCompletedErasure() {
        PrivacyService service = new PrivacyService();
        DataRightsRequestView request = service.createDataRightsRequest("learner-demo-47921",
                new DataRightsRequest(DataRightsRequestType.ERASURE));
        assertEquals("PENDING_MANUAL_REVIEW", request.status());
        assertTrue(request.notice().contains("has not exported or erased data"));
        assertEquals(1, service.listDataRightsRequests("learner-demo-47921").size());
    }
}
