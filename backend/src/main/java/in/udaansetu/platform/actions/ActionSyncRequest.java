package in.udaansetu.platform.actions;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ActionSyncRequest(@NotEmpty @Size(max = 100) List<@Valid ActionWriteRequest> actions) { }
