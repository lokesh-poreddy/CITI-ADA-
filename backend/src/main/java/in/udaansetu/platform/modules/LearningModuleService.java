package in.udaansetu.platform.modules;

import in.udaansetu.platform.modules.ModuleDtos.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LearningModuleService {
    private final Map<String, LearningModule> modules = new ConcurrentHashMap<>();

    public LearningModuleService() {
        LessonDraft l1 = new LessonDraft("Map a practical skill", "Name one skill, where it is used, and how to practise it safely.", "", 15);
        LearningModule seeded = new LearningModule("module-demo-budget", "demo-facilitator", "Everyday money skills",
                "An illustrative short module about planning, saving and comparing choices.", "Secondary learners", "en",
                AccessMode.FREE, BigDecimal.ZERO, ModuleStatus.PUBLISHED, 1, List.of(l1), Instant.now(), Instant.now(), true);
        modules.put(seeded.id(), seeded);
    }

    public List<LearningModule> published(String language, String query) {
        String q = query == null ? "" : query.trim().toLowerCase();
        return modules.values().stream().filter(m -> m.status() == ModuleStatus.PUBLISHED)
                .filter(m -> language == null || language.isBlank() || m.language().equalsIgnoreCase(language))
                .filter(m -> q.isBlank() || (m.title()+" "+m.summary()+" "+m.audience()).toLowerCase().contains(q))
                .sorted(Comparator.comparing(LearningModule::updatedAt).reversed()).toList();
    }
    public List<LearningModule> mine(String actor) {
        requireActor(actor);
        return modules.values().stream().filter(m -> m.creatorKey().equals(actor))
                .sorted(Comparator.comparing(LearningModule::updatedAt).reversed()).toList();
    }
    public LearningModule create(String actor, ModuleDraftRequest request) {
        requireActor(actor); validatePrice(request.accessMode(), request.priceInr());
        LearningModule module = new LearningModule(id(), actor, clean(request.title()), clean(request.summary()),
                clean(request.audience()), clean(request.language()).toLowerCase(), request.accessMode(),
                normalizedPrice(request.accessMode(), request.priceInr()), ModuleStatus.DRAFT, 1,
                safeLessons(request.lessons()), Instant.now(), Instant.now(), false);
        modules.put(module.id(), module); return module;
    }
    public LearningModule update(String actor, String moduleId, ModuleDraftRequest request) {
        LearningModule existing = owned(actor, moduleId); validatePrice(request.accessMode(), request.priceInr());
        LearningModule updated = new LearningModule(existing.id(), actor, clean(request.title()), clean(request.summary()),
                clean(request.audience()), clean(request.language()).toLowerCase(), request.accessMode(),
                normalizedPrice(request.accessMode(), request.priceInr()), ModuleStatus.DRAFT, existing.version()+1,
                safeLessons(request.lessons()), existing.createdAt(), Instant.now(), existing.demoRecord());
        modules.put(moduleId, updated); return updated;
    }
    public PublishResult publish(String actor, String moduleId) {
        LearningModule existing = owned(actor, moduleId);
        List<String> checks = new ArrayList<>();
        if (existing.title().isBlank()) checks.add("Add a module title.");
        if (existing.summary().isBlank()) checks.add("Add a learner-friendly summary.");
        if (existing.lessons().isEmpty()) checks.add("Add at least one lesson before publishing.");
        if (existing.lessons().stream().anyMatch(l -> l.estimatedMinutes() < 0 || l.estimatedMinutes() > 600)) checks.add("Lesson duration must be between 0 and 600 minutes.");
        if (existing.accessMode() == AccessMode.PAID && (existing.priceInr() == null || existing.priceInr().compareTo(BigDecimal.ZERO) <= 0)) checks.add("Paid modules need a positive displayed price.");
        if (!checks.isEmpty()) throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, String.join(" ", checks));
        LearningModule published = new LearningModule(existing.id(), existing.creatorKey(), existing.title(), existing.summary(),
                existing.audience(), existing.language(), existing.accessMode(), existing.priceInr(), ModuleStatus.PUBLISHED,
                existing.version(), existing.lessons(), existing.createdAt(), Instant.now(), existing.demoRecord());
        modules.put(moduleId, published);
        return new PublishResult(published, List.of("Title and summary present", "At least one lesson present", "Access terms are explicit", "Publishing does not process payments"));
    }
    public LearningModule archive(String actor, String moduleId) {
        LearningModule existing = owned(actor, moduleId);
        LearningModule archived = new LearningModule(existing.id(), actor, existing.title(), existing.summary(), existing.audience(),
                existing.language(), existing.accessMode(), existing.priceInr(), ModuleStatus.ARCHIVED, existing.version(),
                existing.lessons(), existing.createdAt(), Instant.now(), existing.demoRecord());
        modules.put(moduleId, archived); return archived;
    }
    private LearningModule owned(String actor, String id) {
        requireActor(actor); LearningModule module = modules.get(id);
        if (module == null || !module.creatorKey().equals(actor)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found.");
        return module;
    }
    private static List<LessonDraft> safeLessons(List<LessonDraft> lessons) { return lessons == null ? List.of() : List.copyOf(lessons); }
    private static void validatePrice(AccessMode mode, BigDecimal price) {
        if (mode == AccessMode.FREE && price != null && price.compareTo(BigDecimal.ZERO) > 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Free modules cannot carry a price.");
        if (mode == AccessMode.PAID && (price == null || price.compareTo(BigDecimal.ZERO) <= 0)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Paid modules require a positive price in INR.");
        if (price != null && price.scale() > 2) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price can have at most two decimal places.");
    }
    private static BigDecimal normalizedPrice(AccessMode mode, BigDecimal p) { return mode == AccessMode.FREE ? BigDecimal.ZERO : p; }
    private static void requireActor(String actor) { if (actor == null || actor.isBlank() || actor.length() > 80) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid demo actor key is required."); }
    private static String clean(String s) { return s == null ? "" : s.trim(); }
    private static String id() { return "module-" + UUID.randomUUID(); }
}
