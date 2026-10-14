package in.udaansetu.platform.opportunity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** Durable store for the human-review queue; pending decisions survive an API restart. */
@Repository
public class OpportunityReviewRepository {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public OpportunityReviewRepository(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public List<ReviewQueueItem> findAll() {
        return jdbcTemplate.query("SELECT payload_json FROM opportunity_review_queue ORDER BY submitted_at DESC",
                (rs, rowNum) -> decode(rs.getString("payload_json")));
    }

    /** Efficient duplicate guard: use the indexed candidate/status columns, not full JSON deserialization. */
    public boolean hasPendingCandidateId(String candidateId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM opportunity_review_queue WHERE candidate_id = ? AND review_status = ?",
                Integer.class, candidateId, "PENDING");
        return count != null && count > 0;
    }

    public Optional<ReviewQueueItem> findById(String reviewId) {
        try {
            return Optional.of(jdbcTemplate.queryForObject(
                    "SELECT payload_json FROM opportunity_review_queue WHERE review_id = ?",
                    (rs, rowNum) -> decode(rs.getString("payload_json")), reviewId));
        } catch (EmptyResultDataAccessException missing) {
            return Optional.empty();
        }
    }

    @Transactional
    public void save(ReviewQueueItem item) {
        jdbcTemplate.update("DELETE FROM opportunity_review_queue WHERE review_id = ?", item.reviewId());
        jdbcTemplate.update("""
                INSERT INTO opportunity_review_queue
                    (review_id, candidate_id, review_status, submitted_at, reviewed_at, payload_json)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                item.reviewId(), item.candidate().id(), item.reviewStatus(),
                Timestamp.from(item.submittedAt()),
                item.reviewedAt() == null ? null : Timestamp.from(item.reviewedAt()), encode(item));
    }

    private String encode(ReviewQueueItem item) {
        try { return objectMapper.writeValueAsString(item); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Review queue record could not be serialized.", exception); }
    }

    private ReviewQueueItem decode(String payload) {
        try { return objectMapper.readValue(payload, ReviewQueueItem.class); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Persisted review queue record could not be decoded; inspect the record before retrying.", exception); }
    }
}
