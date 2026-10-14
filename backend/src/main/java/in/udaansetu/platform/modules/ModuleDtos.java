package in.udaansetu.platform.modules;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class ModuleDtos {
    private ModuleDtos() {}
    public enum AccessMode { FREE, PAID }
    public enum ModuleStatus { DRAFT, PUBLISHED, ARCHIVED }
    public record LessonDraft(@NotBlank @Size(max=140) String title, @Size(max=1200) String summary, String resourceUrl, int estimatedMinutes) {}
    public record ModuleDraftRequest(@NotBlank @Size(max=120) String title,
            @NotBlank @Size(max=800) String summary, @NotBlank @Size(max=80) String audience,
            @NotBlank @Size(max=12) String language, @NotNull AccessMode accessMode,
            @DecimalMin(value="0.0", inclusive=true) BigDecimal priceInr,
            @Valid List<LessonDraft> lessons) {}
    public record LearningModule(String id, String creatorKey, String title, String summary, String audience,
            String language, AccessMode accessMode, BigDecimal priceInr, ModuleStatus status, int version,
            List<LessonDraft> lessons, Instant createdAt, Instant updatedAt, boolean demoRecord) {}
    public record PublishResult(LearningModule module, List<String> checks) {}
}
