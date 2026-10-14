package in.udaansetu.platform.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** CORS is restricted to explicit frontend origins; do not use wildcard credentials. */
@Configuration
public class WebCorsConfiguration implements WebMvcConfigurer {
    private final List<String> allowedOrigins;

    public WebCorsConfiguration(
            @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}") String origins) {
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("Accept", "Content-Type", "Authorization", "X-Request-Id", "X-Learner-Key", "X-Actor-Key", "X-Partner-Key", "X-Reviewer-Token", "Idempotency-Key")
                .exposedHeaders("X-Request-Id")
                .maxAge(3600);
    }
}
