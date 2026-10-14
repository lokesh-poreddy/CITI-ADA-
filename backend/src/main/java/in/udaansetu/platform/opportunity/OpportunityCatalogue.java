package in.udaansetu.platform.opportunity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.event.EventListener;

/**
 * Opportunity catalogue backed by the configured relational database in the application runtime.
 * The no-argument constructor intentionally retains a small in-memory mode for isolated domain tests.
 * Public records remain source-linked and reference-only data is never presented as a confirmed open opportunity.
 */
@Repository
public class OpportunityCatalogue {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    private final Map<String, Opportunity> inMemory = new ConcurrentHashMap<>();

    /** Test-only in-memory catalogue for focused service tests. */
    public OpportunityCatalogue() {
        this.jdbcTemplate = null;
        this.objectMapper = new ObjectMapper().findAndRegisterModules();
        seedReviewedSourceReferences();
    }

    @Autowired
    public OpportunityCatalogue(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
        // Flyway schema migrations complete before ApplicationReadyEvent. Seed after migrations are available.
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedDatabaseAfterMigrations() {
        if (jdbcTemplate != null) seedReviewedSourceReferences();
    }

    public List<Opportunity> findAll() {
        LocalDate today = LocalDate.now();
        List<Opportunity> records = readAll();
        return records.stream()
                .filter(o -> o.listingStatus() == ListingStatus.PUBLISHED || o.listingStatus() == ListingStatus.REFERENCE_ONLY)
                .filter(o -> o.deadline() == null || !o.deadline().isBefore(today) || o.listingStatus() == ListingStatus.REFERENCE_ONLY)
                .sorted(Comparator.comparing((Opportunity o) -> o.deadline() == null ? LocalDate.MAX : o.deadline())
                        .thenComparing(Opportunity::title, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    public List<Opportunity> search(String query, OpportunityType type, String state, String language) {
        String needle = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        return findAll().stream()
                .filter(o -> type == null || o.type() == type)
                .filter(o -> state == null || state.isBlank() || o.eligibleStates().isEmpty() || o.eligibleStates().stream().anyMatch(s -> s.equalsIgnoreCase(state.trim())) || "All India".equalsIgnoreCase(o.locationLabel()))
                .filter(o -> language == null || language.isBlank() || o.languageCodes().isEmpty() || o.languageCodes().contains(language.toLowerCase(Locale.ROOT)))
                .filter(o -> needle.isBlank() || searchable(o).contains(needle))
                .toList();
    }

    public Optional<Opportunity> findById(String id) {
        if (jdbcTemplate == null) return Optional.ofNullable(inMemory.get(id));
        try {
            return Optional.of(jdbcTemplate.queryForObject(
                    "SELECT payload_json FROM opportunity_catalogue WHERE id = ?",
                    (rs, rowNum) -> decode(rs.getString("payload_json")), id));
        } catch (EmptyResultDataAccessException missing) {
            return Optional.empty();
        }
    }

    public boolean exists(String id) {
        if (jdbcTemplate == null) return inMemory.containsKey(id);
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM opportunity_catalogue WHERE id = ?", Integer.class, id);
        return count != null && count > 0;
    }

    @Transactional
    public void publish(Opportunity opportunity) {
        if (jdbcTemplate == null) {
            inMemory.put(opportunity.id(), opportunity);
            return;
        }
        String payload = encode(opportunity);
        // Update existing rows in place so created_at is stable; insert only for a new record.
        int updated = jdbcTemplate.update("""
                UPDATE opportunity_catalogue
                   SET title = ?, opportunity_type = ?, listing_status = ?, deadline = ?,
                       source_url = ?, payload_json = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?
                """,
                opportunity.title(), opportunity.type().name(), opportunity.listingStatus().name(),
                opportunity.deadline(), opportunity.sourceUrl(), payload, opportunity.id());
        if (updated == 0) {
            jdbcTemplate.update("""
                    INSERT INTO opportunity_catalogue
                        (id, title, opportunity_type, listing_status, deadline, source_url, payload_json, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    """,
                    opportunity.id(), opportunity.title(), opportunity.type().name(), opportunity.listingStatus().name(),
                    opportunity.deadline(), opportunity.sourceUrl(), payload);
        }
    }

    public int countForDiagnostics() {
        if (jdbcTemplate == null) return inMemory.size();
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM opportunity_catalogue", Integer.class);
        return count == null ? 0 : count;
    }

    private List<Opportunity> readAll() {
        if (jdbcTemplate == null) return new ArrayList<>(inMemory.values());
        return jdbcTemplate.query("SELECT payload_json FROM opportunity_catalogue",
                (rs, rowNum) -> decode(rs.getString("payload_json")));
    }

    private String encode(Opportunity opportunity) {
        try { return objectMapper.writeValueAsString(opportunity); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Opportunity could not be serialized for persistence.", exception); }
    }

    private Opportunity decode(String payload) {
        try { return objectMapper.readValue(payload, Opportunity.class); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Persisted opportunity record is not readable; inspect the record and migration before recovery.", exception); }
    }

    private String searchable(Opportunity o) {
        return (o.id() + " " + o.title() + " " + o.summary() + " " + o.provider() + " " + o.type() + " " + String.join(" ", o.tags())).toLowerCase(Locale.ROOT);
    }

    private void seedReviewedSourceReferences() {
        LocalDate checked = LocalDate.of(2026, 10, 14);
        List<Opportunity> seeds = new ArrayList<>();
        seeds.add(new Opportunity("nsp-pm-usp-csss-renewal-2026", "PM-USP CSSS — renewal notice (AY 2026–27)",
                "The National Scholarship Portal lists a renewal window for the PM-USP Central Sector Scheme of Scholarship for College and University Students. Review the official notice and scheme criteria before acting.",
                OpportunityType.SCHOLARSHIP, "National Scholarship Portal", "All India", Set.of("en", "hi"),
                List.of("scholarship", "college", "renewal", "financial aid"), "National Scholarship Portal",
                "https://scholarships.gov.in/Students", "https://scholarships.gov.in/Students", SourceTrust.OFFICIAL_PORTAL,
                ListingStatus.PUBLISHED, checked, null, LocalDate.of(2026, 10, 31),
                Set.of(), Set.of(), null, null, null, false, false,
                List.of("Check the current official notice for required documents"), "Open the portal and confirm that the scheme and renewal category apply to you."));
        seeds.add(reference("nsp-scholarship-discovery", "National Scholarship Portal — scholarship discovery",
                "Use the official portal to discover scholarships and check the current academic-year notice, scheme eligibility, application windows and required documents. This is a portal reference, not a claim that every scheme is open.",
                OpportunityType.SCHOLARSHIP, "National Scholarship Portal", "https://scholarships.gov.in/All-Scholarships", checked,
                List.of("scholarship", "financial aid", "student support", "government scheme")));
        seeds.add(reference("skill-india-course-explorer", "Skill India Digital Hub — course explorer", "Explore skills courses and related opportunities across sectors. Availability, language, duration and eligibility vary by listing; check the provider page.", OpportunityType.COURSE, "Skill India Digital Hub", "https://www.skillindiadigital.gov.in/free-online-courses/", checked, List.of("skills", "vocational", "courses", "career")));
        seeds.add(reference("swayam-course-explorer", "SWAYAM — course search", "Search courses published on the official SWAYAM platform. Confirm enrolment windows, prerequisites, language and certificate/exam details on the course page.", OpportunityType.COURSE, "SWAYAM / Ministry of Education", "https://swayam.gov.in/search_courses", checked, List.of("courses", "online learning", "higher education")));
        seeds.add(reference("diksha-learning-library", "DIKSHA — learning resources", "Open the DIKSHA learning platform to explore learning resources. This is a portal reference, not an individual course recommendation.", OpportunityType.RESOURCE, "DIKSHA", "https://diksha.gov.in/", checked, List.of("school", "learning resources", "teacher")));
        seeds.add(reference("ncs-career-services", "National Career Service — career and employment services", "Explore career guidance and employment-related services on the official portal. Listings and eligibility must be checked individually.", OpportunityType.RESOURCE, "National Career Service", "https://www.ncs.gov.in/", checked, List.of("career guidance", "jobs", "employment")));
        seeds.add(reference("apprenticeship-india-explorer", "Apprenticeship India — opportunity explorer", "Visit the official apprenticeship portal to explore current apprenticeship information. This record does not represent a specific open vacancy.", OpportunityType.APPRENTICESHIP, "Apprenticeship India", "https://www.apprenticeshipindia.gov.in/", checked, List.of("apprenticeship", "work-based learning", "skills")));
        seeds.add(reference("bhashini-language-services", "BHASHINI — language technology resources", "Explore language technology and developer resources for Indian language experiences. Integration access, service coverage and terms must be confirmed before use.", OpportunityType.RESOURCE, "BHASHINI", "https://bhashini.gov.in/", checked, List.of("languages", "speech", "translation", "accessibility")));
        // Seed only missing IDs. A reviewed record must never be silently replaced on application restart.
        seeds.stream().filter(seed -> !exists(seed.id())).forEach(this::publish);
    }

    private Opportunity reference(String id, String title, String summary, OpportunityType type, String provider,
                                  String url, LocalDate checked, List<String> tags) {
        return new Opportunity(id, title, summary, type, provider, "All India", Set.of("en", "hi", "ta"), tags,
                provider, url, url, SourceTrust.REFERENCE_ONLY, ListingStatus.REFERENCE_ONLY, checked, null, null,
                Set.of(), Set.of(), null, null, null, false, false,
                List.of(), "Open the official source and verify current availability, eligibility and deadlines.");
    }
}
