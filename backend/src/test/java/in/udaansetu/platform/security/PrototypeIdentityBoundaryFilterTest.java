package in.udaansetu.platform.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import jakarta.servlet.FilterChain;
import java.util.concurrent.atomic.AtomicBoolean;

class PrototypeIdentityBoundaryFilterTest {
    @Test
    void productionModeFailsClosedForProfileAndActionRoutes() throws Exception {
        PrototypeIdentityBoundaryFilter filter = new PrototypeIdentityBoundaryFilter(false);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/learners/profiles");
        request.addHeader("X-Actor-Key", "spoofed-client-actor");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertEquals(503, response.getStatus());
        assertTrue(response.getContentAsString().contains("PROTOTYPE_IDENTITY_DISABLED"));
    }

    @Test
    void productionModeKeepsReadOnlyPublicDiscoveryAvailable() throws Exception {
        PrototypeIdentityBoundaryFilter filter = new PrototypeIdentityBoundaryFilter(false);
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/opportunities");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean continued = new AtomicBoolean(false);
        FilterChain chain = (servletRequest, servletResponse) -> continued.set(true);

        filter.doFilter(request, response, chain);

        assertEquals(200, response.getStatus());
        assertTrue(continued.get());
    }
}
