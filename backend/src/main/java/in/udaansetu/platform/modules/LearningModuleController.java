package in.udaansetu.platform.modules;

import in.udaansetu.platform.modules.ModuleDtos.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/learning-modules")
public class LearningModuleController {
    private final LearningModuleService service;
    public LearningModuleController(LearningModuleService service) { this.service = service; }
    @GetMapping public List<LearningModule> published(@RequestParam(required=false) String language, @RequestParam(required=false) String q) { return service.published(language, q); }
    @GetMapping("/mine") public List<LearningModule> mine(@RequestHeader("X-Actor-Key") String actor) { return service.mine(actor); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public LearningModule create(@RequestHeader("X-Actor-Key") String actor, @Valid @RequestBody ModuleDraftRequest request) { return service.create(actor, request); }
    @PutMapping("/{id}") public LearningModule update(@RequestHeader("X-Actor-Key") String actor, @PathVariable String id, @Valid @RequestBody ModuleDraftRequest request) { return service.update(actor, id, request); }
    @PostMapping("/{id}/publish") public PublishResult publish(@RequestHeader("X-Actor-Key") String actor, @PathVariable String id) { return service.publish(actor, id); }
    @PostMapping("/{id}/archive") public LearningModule archive(@RequestHeader("X-Actor-Key") String actor, @PathVariable String id) { return service.archive(actor, id); }
}
