package in.udaansetu.platform.notifications;

import in.udaansetu.platform.notifications.NotificationDtos.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService service;
    public NotificationController(NotificationService service){this.service=service;}
    @GetMapping public List<Reminder> list(@RequestParam String recipientKey){return service.list(recipientKey);}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Reminder create(@Valid @RequestBody ReminderCreateRequest request){return service.create(request);}
    @PostMapping("/{id}/acknowledge") public Reminder acknowledge(@RequestParam String recipientKey,@PathVariable String id){return service.acknowledge(recipientKey,id);}
    @GetMapping("/preferences") public NotificationPreferences preferences(@RequestParam String actorKey){return service.getPreferences(actorKey);}
    @PutMapping("/preferences") public NotificationPreferences savePreferences(@RequestParam String actorKey,@Valid @RequestBody NotificationPreferencesRequest request){return service.savePreferences(actorKey,request);}
}
