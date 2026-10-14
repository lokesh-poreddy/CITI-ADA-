package in.udaansetu.platform.opportunity;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record IngestionPreviewRequest(@NotEmpty @Size(max = 100) List<@Valid IngestionCandidateRequest> records) { }
