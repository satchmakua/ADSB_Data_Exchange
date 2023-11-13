CREATE TABLE adsb_messages (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    raw_data BYTEA,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_adsb_messages_type ON adsb_messages(type);
CREATE INDEX idx_adsb_messages_timestamp ON adsb_messages(timestamp);
