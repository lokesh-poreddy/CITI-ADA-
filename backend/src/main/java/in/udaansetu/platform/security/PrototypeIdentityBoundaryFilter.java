package in.udaansetu.platform.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Fail-closed guard for endpoints that still rely on spoofable prototype actor headers.
 * The production profile disables these endpoints until a real identity provider and RBAC adapter are configured.
 * This is a safety gate, not a substitute for authentication.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 30)
public class PrototypeIdentityBoundaryFilter extends OncePerRequestFilter {
    private static final Set<String> ALWAYS_PROTECTED_PREFIXES = Set.of(
            "/api/v1/learners/profiles",
            "/api/v1/student/opportunity-actions",
            "/api/v1/privacy/consents",
            "/api/v1/privacy/data-rights-requests",
            "/api/v1/opportunity-ingestion",
            "/api/v1/facilitator",
            "/api/v1/notifications",
            "/api/v1/analytics/summary",
            "/api/v1/analytics/events",
            "/api/v1/sustainability/interest");

    private final boolean prototypeIdentitiesEnabled;

    public PrototypeIdentityBoundaryFilter(
            @org.springframework.beans.factory.annotation.Value("${app.prototype-identities-enabled:true}") boolean prototypeIdentitiesEnabled) {
        this.prototypeIdentitiesEnabled = prototypeIdentitiesEnabled;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (prototypeIdentitiesEnabled || !requiresPrototypeIdentity(request)) {
            chain.doFilter(request, response);
            return;
        }
        response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.getWriter().write("""
                {"type":"about:blank","title":"Identity provider required","status":503,"code":"PROTOTYPE_IDENTITY_DISABLED","detail":"This endpoint relies on prototype identity headers and is disabled by the production profile. Configure authenticated identity and role-based authorization before enabling it."}
                """);
    }

    private boolean requiresPrototypeIdentity(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        if (ALWAYS_PROTECTED_PREFIXES.stream().anyMatch(path::startsWith)) return true;

        if (path.equals("/api/v1/mentors") && !"GET".equalsIgnoreCase(method)) return true;
        if (path.startsWith("/api/v1/mentors/review-queue")
                || path.endsWith("/verify")
                || path.contains("/connection-requests")) return true;

        if (path.startsWith("/api/v1/partner-listings")) {
            return !"GET".equalsIgnoreCase(method)
                    || path.endsWith("/mine")
                    || path.contains("/review-queue")
                    || path.endsWith("/review");
        }

        if (path.startsWith("/api/v1/learning-modules")) {
            return !"GET".equalsIgnoreCase(method) || path.endsWith("/mine");
        }
        return false;
    }
}
