package in.udaansetu.platform.actions;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/student/opportunity-actions")
public class StudentActionController {
    private final StudentActionService service;
    public StudentActionController(StudentActionService service) { this.service = service; }

    @GetMapping public List<StudentOpportunityAction> list(@RequestHeader("X-Learner-Key") String learnerKey) {
        return service.list(learnerKey);
    }

    @PostMapping public StudentOpportunityAction write(@RequestHeader("X-Learner-Key") String learnerKey, @Valid @RequestBody ActionWriteRequest request) {
        return service.apply(learnerKey, request);
    }

    @PostMapping("/sync") public List<StudentOpportunityAction> sync(@RequestHeader("X-Learner-Key") String learnerKey, @Valid @RequestBody ActionSyncRequest request) {
        return service.sync(learnerKey, request);
    }
}
