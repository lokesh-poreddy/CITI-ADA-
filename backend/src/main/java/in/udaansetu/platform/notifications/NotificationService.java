package in.udaansetu.platform.notifications;

import in.udaansetu.platform.notifications.NotificationDtos.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationService {
    private final Map<String, Reminder> reminders = new ConcurrentHashMap<>();
    private final Map<String, NotificationPreferences> preferences = new ConcurrentHashMap<>();
    public NotificationService() {
        Reminder demo = new Reminder("reminder-demo-pathway","demo-learner",ReminderKind.LEARNING_STEP,"Revisit your saved pathway","A gentle reminder to review one next step. This is an illustrative demo reminder.",LocalDateTime.now(ZoneId.of("Asia/Kolkata")).plusDays(1),ReminderStatus.SCHEDULED,"pathway-demo",Instant.now(),Instant.now());
        reminders.put(demo.id(),demo);
    }
    public List<Reminder> list(String recipientKey) { requireActor(recipientKey); return reminders.values().stream().filter(r->r.recipientKey().equals(recipientKey)).map(this::promoteIfDue).sorted(Comparator.comparing(Reminder::scheduledAt)).toList(); }
    public Reminder create(ReminderCreateRequest request) {
        requireActor(request.recipientKey());
        Reminder reminder=new Reminder("reminder-"+UUID.randomUUID(),request.recipientKey(),request.kind(),request.title().trim(),request.message().trim(),request.scheduledAt(),request.scheduledAt().isAfter(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))?ReminderStatus.SCHEDULED:ReminderStatus.READY,clean(request.relatedRecordId()),Instant.now(),Instant.now());
        reminders.put(reminder.id(),reminder); return reminder;
    }
    public Reminder acknowledge(String recipientKey,String id) {
        requireActor(recipientKey); Reminder reminder=reminders.get(id);
        if(reminder==null||!reminder.recipientKey().equals(recipientKey)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Reminder not found.");
        Reminder updated=new Reminder(reminder.id(),reminder.recipientKey(),reminder.kind(),reminder.title(),reminder.message(),reminder.scheduledAt(),ReminderStatus.ACKNOWLEDGED,reminder.relatedRecordId(),reminder.createdAt(),Instant.now());
        reminders.put(id,updated); return updated;
    }
    public NotificationPreferences getPreferences(String actor) { requireActor(actor); return preferences.computeIfAbsent(actor,k->defaultPreferences(k)); }
    public NotificationPreferences savePreferences(String actor,NotificationPreferencesRequest req) {
        requireActor(actor);
        if ((req.emailEnabled()||req.smsEnabled()) && !req.consentToExternalDelivery()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Explicit consent is required before enabling an external delivery channel.");
        NotificationPreferences saved=new NotificationPreferences(actor,true,req.emailEnabled(),req.smsEnabled(),req.consentToExternalDelivery(),Instant.now(),"This prototype delivers only in-app reminders. Email/SMS are preferences only until a provider is configured and tested.");
        preferences.put(actor,saved);return saved;
    }
    private Reminder promoteIfDue(Reminder r) {
        if(r.status()==ReminderStatus.SCHEDULED && !r.scheduledAt().isAfter(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))) {
            Reminder ready=new Reminder(r.id(),r.recipientKey(),r.kind(),r.title(),r.message(),r.scheduledAt(),ReminderStatus.READY,r.relatedRecordId(),r.createdAt(),Instant.now()); reminders.put(r.id(),ready); return ready;
        }
        return r;
    }
    private static NotificationPreferences defaultPreferences(String actor){return new NotificationPreferences(actor,true,false,false,false,Instant.now(),"In-app only; external channels are not connected.");}
    private static void requireActor(String actor){if(actor==null||actor.isBlank()||actor.length()>80)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"A valid demo recipient key is required.");}
    private static String clean(String s){return s==null?"":s.trim();}
}
