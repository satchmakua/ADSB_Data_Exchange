-- Message Database Schema
CREATE TABLE adsb_messages (
    message_id SERIAL PRIMARY KEY,
    icao_address CHAR(6) NOT NULL,
    call_sign VARCHAR(8),
    altitude INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    vertical_rate INTEGER,
    ground_speed INTEGER,
    track_angle INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    message_data BYTEA NOT NULL
);

CREATE INDEX idx_adsb_messages_type ON adsb_messages(type);
CREATE INDEX idx_adsb_messages_timestamp ON adsb_messages(timestamp);
