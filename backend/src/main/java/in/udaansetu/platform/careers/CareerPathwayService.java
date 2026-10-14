package in.udaansetu.platform.careers;

import in.udaansetu.platform.learners.LearnerProfile;
import in.udaansetu.platform.learners.LearnerProfileService;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Deterministic, explainable starter matcher. It is not an aptitude test or an AI diagnosis. */
@Service
public class CareerPathwayService {
    private static final String SOURCE_NOTICE = "Resource links are discovery references. Check current eligibility, language, cost, availability and deadlines with the official provider.";
    private static final String GENERAL_CAUTION = "These suggestions are exploration prompts, not an assessment or guarantee of admission, employment, income, or eligibility. Discuss consequential decisions with a trusted teacher/facilitator.";
    private final LearnerProfileService profiles;
    private final List<CareerPathwayDefinition> catalogue = buildCatalogue();

    public CareerPathwayService(LearnerProfileService profiles) { this.profiles = profiles; }

    public List<CareerPathwaySummary> list() {
        return catalogue.stream().map(path -> new CareerPathwaySummary(path.id(), path.category(), path.title(), path.summary(), path.interests())).toList();
    }

    public CareerRecommendationResponse recommend(String learnerId) {
        LearnerProfile learner = profiles.findActive(learnerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The temporary learner profile has expired or cannot be found. Create it again or use local matching."));
        var profile = learner.profile();
        Set<String> interests = Set.copyOf(profile.interests());
        Set<String> strengths = Set.copyOf(profile.strengths());
        Set<String> goals = Set.copyOf(profile.goals());
        String stage = profile.academicStage();

        List<CareerRecommendationItem> results = catalogue.stream().map(path -> {
            List<String> matched = new ArrayList<>();
            int score = 18;
            // Sort set iteration explicitly so explanations remain stable across JVMs/runs.
            for (String tag : path.interests().stream().sorted().toList()) if (interests.contains(tag)) { score += 13; matched.add(tag); }
            for (String tag : path.strengths().stream().sorted().toList()) if (strengths.contains(tag)) { score += 11; matched.add(tag); }
            for (String tag : path.goals().stream().sorted().toList()) if (goals.contains(tag)) { score += 6; matched.add(tag); }
            if (path.academicStages().contains(stage)) score += 7;
            int relativeFit = Math.min(94, Math.max(22, score));
            return new CareerRecommendationItem(path.id(), relativeFit, matched.stream().limit(3).toList(),
                    matched.isEmpty() ? "Shown as an additional path to widen exploration." : "Ranked from the interest, strength and goal choices you selected.");
        }).sorted(Comparator.comparingInt(CareerRecommendationItem::relativeFit).reversed().thenComparing(CareerRecommendationItem::pathwayId)).limit(3).toList();
        return new CareerRecommendationResponse(results, Instant.now(), GENERAL_CAUTION);
    }

    public LearningPathwayResponse detail(String pathwayId) {
        CareerPathwayDefinition path = catalogue.stream().filter(candidate -> candidate.id().equals(pathwayId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pathway not found."));
        return new LearningPathwayResponse(path.id(), path.title(), path.summary(), path.steps(), path.resources(), path.caution(), SOURCE_NOTICE);
    }

    public int catalogueSizeForTests() { return catalogue.size(); }

    private static List<CareerPathwayDefinition> buildCatalogue() {
        Set<String> allStages = Set.of("std9_10", "std11_12", "diploma_iti", "undergraduate", "graduate");
        return List.of(
            path("skilled-technical", "vocational", "Build, repair & work with technology",
                "Explore hands-on technical work, trades, repair, electronics and practical problem-solving.",
                Set.of("handsOn", "technology", "science", "nature"), Set.of("practical", "problemSolving", "patient"), Set.of("skillCertificate", "employment", "entrepreneurship"), allStages,
                steps("Explore a foundation skill", "Try an introductory topic such as electronics, repair, fabrication, electrical safety or digital tools.", "Compare recognised training routes", "Check nearby ITI/polytechnic and approved vocational options; compare entry rules, travel, costs and practice time.", "Build evidence of learning", "Keep a small project log. Ask a facilitator to review safety and quality before sharing work."),
                resources(resource("Skill India Digital Hub", "https://www.skillindiadigital.gov.in/", "Explore skills and training; verify each course's current requirements."), resource("National Career Service", "https://www.ncs.gov.in/", "Explore career information; verify local availability.")),
                "Some trades require formal training, supervised practice, safety equipment or licences. Verify requirements locally."),
            path("digital-creative", "creative", "Create, design & communicate",
                "Explore visual design, content, local-language communication, media and digital creation.",
                Set.of("design", "communication", "technology", "business"), Set.of("creative", "communication", "organizing"), Set.of("skillCertificate", "entrepreneurship", "employment"), allStages,
                steps("Try a small creative brief", "Make a poster, explainer, short audio, photo story or simple webpage for a community topic.", "Learn one tool and one principle", "Study layout, readability, story structure or audio clarity; use free or accessible tools where possible.", "Build a small portfolio", "Keep 3–5 samples and explain your choices; get feedback before posting personal information publicly."),
                resources(resource("SWAYAM", "https://swayam.gov.in/", "Search courses; confirm enrolment, language and certificate details."), resource("DIKSHA", "https://diksha.gov.in/", "Explore learning materials and resources.")),
                "A portfolio demonstrates practice but does not guarantee paid work. Verify age rules and platform safety before publishing."),
            path("community-care", "community", "Support people & strengthen communities",
                "Explore education support, community services, care-related fields and people-facing work.",
                Set.of("helping", "communication", "science", "teaching"), Set.of("caring", "patient", "communication", "organizing"), Set.of("higherStudy", "employment", "skillCertificate"), allStages,
                steps("Explore a community problem", "Choose an age-appropriate topic such as learning access, health awareness or local service navigation.", "Learn the boundaries of the role", "Review training, supervision, safeguarding and qualification requirements; do not offer regulated services without credentials.", "Find a supervised learning opportunity", "Ask a teacher or trusted organisation about approved study, volunteering or skill pathways."),
                resources(resource("National Career Service", "https://www.ncs.gov.in/", "Explore career information and verify provider requirements.")),
                "Care, health and education roles can have formal qualifications and safeguarding requirements. This is not professional eligibility advice."),
            path("green-agri-enterprise", "enterprise", "Work with nature, food & local enterprise",
                "Explore agriculture, food processing, environment, local business and practical sustainability.",
                Set.of("nature", "handsOn", "business", "science"), Set.of("practical", "organizing", "problemSolving"), Set.of("entrepreneurship", "skillCertificate", "employment"), allStages,
                steps("Map one local need", "Talk to a teacher or trusted adult about a food, farming, water, energy or waste challenge.", "Learn a practical method", "Explore an age-appropriate course or demonstration; do not invest money or handle equipment without supervision.", "Test a small, safe idea", "Document the problem, likely users, costs and constraints before considering an enterprise."),
                resources(resource("Skill India Digital Hub", "https://www.skillindiadigital.gov.in/", "Explore current practical skill programmes."), resource("SWAYAM", "https://swayam.gov.in/", "Search courses and check programme details.")),
                "Enterprise ideas need local validation and cost checks. Minors need trusted adult supervision; income is not guaranteed."),
            path("data-business", "analytical", "Work with numbers, data & organisation",
                "Explore accounting support, data handling, business operations, commerce and analytical study.",
                Set.of("numbers", "technology", "business", "science"), Set.of("analytical", "organizing", "problemSolving"), Set.of("higherStudy", "employment", "examPreparation"), allStages,
                steps("Strengthen number and digital basics", "Practice spreadsheets, arithmetic, charts and record keeping using sample data only.", "Try a small analysis task", "Organise a mock budget or public dataset and explain what it can—and cannot—tell you.", "Compare study and credential routes", "Review commerce, statistics, business, computer and vocational options with an educator."),
                resources(resource("SWAYAM", "https://swayam.gov.in/", "Explore current foundational courses and verify levels.")),
                "Do not upload personal, financial or school records into practice exercises; use sample data."),
            path("education-language", "communication", "Teach, explain & work with language",
                "Explore peer learning, language support, communication, education and knowledge sharing.",
                Set.of("teaching", "communication", "design", "helping"), Set.of("communication", "patient", "organizing", "creative"), Set.of("higherStudy", "employment", "skillCertificate"), allStages,
                steps("Explain one thing clearly", "Create a short explanation, glossary, audio note or peer-study guide on a topic you know.", "Learn facilitation basics", "Practice listening, checking understanding, giving respectful feedback and protecting learner privacy.", "Review formal requirements", "Teaching and translation roles may require specific qualifications; confirm current rules before planning."),
                resources(resource("DIKSHA", "https://diksha.gov.in/", "Explore learning materials and educator resources.")),
                "Formal teaching or translation roles may require qualifications, training or screening; verify current rules.")
        );
    }

    private static CareerPathwayDefinition path(String id, String category, String title, String summary, Set<String> interests,
            Set<String> strengths, Set<String> goals, Set<String> stages, List<LearningStep> steps, List<LearningResource> resources, String caution) {
        return new CareerPathwayDefinition(id, category, title, summary, interests, strengths, goals, stages, steps, resources, caution);
    }
    private static List<LearningStep> steps(String title1, String desc1, String title2, String desc2, String title3, String desc3) {
        return List.of(new LearningStep("step-1", title1, desc1, "EXPLORE"), new LearningStep("step-2", title2, desc2, "COMPARE"), new LearningStep("step-3", title3, desc3, "PRACTICE"));
    }
    private static LearningResource resource(String title, String url, String note) { return new LearningResource(title, url, note); }
    private static List<LearningResource> resources(LearningResource... values) { return List.of(values); }
}
