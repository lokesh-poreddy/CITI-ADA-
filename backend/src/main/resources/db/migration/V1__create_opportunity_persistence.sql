CREATE TABLE IF NOT EXISTS opportunity_catalogue (
    id VARCHAR(160) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    opportunity_type VARCHAR(48) NOT NULL,
    listing_status VARCHAR(40) NOT NULL,
    deadline DATE NULL,
    source_url VARCHAR(2048) NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_opportunity_catalogue_status_type
    ON opportunity_catalogue (listing_status, opportunity_type);
CREATE INDEX IF NOT EXISTS idx_opportunity_catalogue_deadline
    ON opportunity_catalogue (deadline);

CREATE TABLE IF NOT EXISTS opportunity_review_queue (
    review_id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(160) NOT NULL,
    review_status VARCHAR(24) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    payload_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_opportunity_review_status_submitted
    ON opportunity_review_queue (review_status, submitted_at);
CREATE INDEX IF NOT EXISTS idx_opportunity_review_candidate
    ON opportunity_review_queue (candidate_id);
