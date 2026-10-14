-- Keeps duplicate-candidate checks efficient as the review queue grows.
-- V1 remains immutable; this additive migration is safe for H2 and PostgreSQL.
CREATE INDEX IF NOT EXISTS idx_opportunity_review_candidate_status
    ON opportunity_review_queue (candidate_id, review_status);
