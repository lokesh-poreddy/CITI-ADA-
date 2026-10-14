package in.udaansetu.platform.mentors;

import in.udaansetu.platform.mentors.MentorDtos.*;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MentorService {
    private final Map<String, MentorProfile> mentors = new ConcurrentHashMap<>();
    private final Map<String, MentorConnectionRequest> requests = new ConcurrentHashMap<>();
    public MentorService() {
        seed("mentor-demo-design", "Illustrative mentor · Design", "Design and communication", "Helps learners explore portfolio-building and visual communication pathways.", "Tamil Nadu", List.of("ta","en"), "Community partner (demo)");
        seed("mentor-demo-skills", "Illustrative mentor · Skilled trades", "Technical and vocational skills", "Discusses safe ways to explore technical training and vocational pathways.", "South India", List.of("ta","hi","en"), "Training partner (demo)");
        seed("mentor-demo-care", "Illustrative mentor · Community services", "Community and care services", "Shares broad information about training routes in community-facing work.", "India", List.of("hi","en"), "NGO partner (demo)");
    }
    private void seed(String id, String name, String expertise, String bio, String region, List<String> languages, String org) {
        mentors.put(id, new MentorProfile(id,name,expertise,bio,region,languages,org,true,"Request through facilitator",true,Instant.now()));
    }
    public List<MentorProfile> discover(String expertise, String language, String region) {
        return mentors.values().stream().filter(MentorProfile::verified)
                .filter(m -> blank(expertise) || m.expertise().toLowerCase().contains(expertise.toLowerCase()))
                .filter(m -> blank(language) || m.languages().stream().anyMatch(l -> l.equalsIgnoreCase(language)))
                .filter(m -> blank(region) || m.region().equalsIgnoreCase("India") || m.region().toLowerCase().contains(region.toLowerCase()))
                .sorted(Comparator.comparing(MentorProfile::demoProfile).thenComparing(MentorProfile::displayName)).toList();
    }

    public List<MentorProfile> reviewQueue() {
        return mentors.values().stream().filter(m -> !m.verified() && !m.demoProfile())
                .sorted(Comparator.comparing(MentorProfile::submittedAt)).toList();
    }

    public MentorProfile submit(MentorSubmission submission) {
        String id = "mentor-" + UUID.randomUUID();
        MentorProfile profile = new MentorProfile(id, clean(submission.displayName()), clean(submission.expertise()),
                clean(submission.bio()), clean(submission.region()), splitLanguages(submission.languages()),
                clean(submission.organization()), false, "Unavailable until verification", false, Instant.now());
        mentors.put(id, profile); return profile;
    }
    public MentorProfile verify(String id, MentorVerificationRequest request) {
        MentorProfile m = mentors.get(id);
        if (m == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mentor profile not found.");
        String decision = clean(request.decision()).toUpperCase();
        if (!decision.equals("APPROVE") && !decision.equals("REJECT")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Decision must be APPROVE or REJECT.");
        MentorProfile updated = new MentorProfile(m.id(), m.displayName(), m.expertise(), m.bio(), m.region(), m.languages(), m.organization(), decision.equals("APPROVE"), decision.equals("APPROVE") ? "Request through facilitator" : "Not available", m.demoProfile(), m.submittedAt());
        mentors.put(id, updated); return updated;
    }
    public MentorConnectionRequest requestConnection(String mentorId, ConnectionRequest request) {
        MentorProfile mentor = mentors.get(mentorId);
        if (mentor == null || !mentor.verified()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Verified mentor not found.");
        MentorConnectionRequest connection = new MentorConnectionRequest("mreq-" + UUID.randomUUID(), mentorId,
                clean(request.learnerAlias()), clean(request.purpose()), clean(request.facilitatorKey()), "PENDING_FACILITATOR_REVIEW",
                Instant.now(), "No personal contact details are shared. A facilitator must review and coordinate any next step.");
        requests.put(connection.id(), connection); return connection;
    }
    public List<MentorConnectionRequest> listRequests(String facilitatorKey) {
        requireActor(facilitatorKey);
        return requests.values().stream().filter(r -> r.facilitatorKey().equals(facilitatorKey)).sorted(Comparator.comparing(MentorConnectionRequest::createdAt).reversed()).toList();
    }
    private static List<String> splitLanguages(String raw) { return List.of(raw.split(",")).stream().map(String::trim).filter(s -> !s.isBlank()).map(String::toLowerCase).distinct().toList(); }
    private static boolean blank(String s) { return s == null || s.isBlank(); }
    private static String clean(String s) { return s == null ? "" : s.trim(); }
    private static void requireActor(String actor) { if (blank(actor) || actor.length()>80) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"A valid facilitator key is required."); }
}
