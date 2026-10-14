package in.udaansetu.platform.security;

import static org.junit.jupiter.api.Assertions.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockFilterChain;

class SecurityControlsFilterTest {
    private final SecurityControlsFilter filter = new SecurityControlsFilter();

    @Test
    void setsSecurityHeadersAndReplacesInvalidRequestId() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/health");
        request.addHeader("X-Request-Id", "bad value with spaces");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = new MockFilterChain();
        filter.doFilter(request, response, chain);
        assertEquals("nosniff", response.getHeader("X-Content-Type-Options"));
        assertEquals("DENY", response.getHeader("X-Frame-Options"));
        assertNotNull(response.getHeader("X-Request-Id"));
        assertFalse(response.getHeader("X-Request-Id").contains(" "));
    }

    @Test
    void rejectsKnownOversizedApiContentLength() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/analytics/events");
        request.setContentLength(1_048_577);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        assertEquals(413, response.getStatus());
    }
}
