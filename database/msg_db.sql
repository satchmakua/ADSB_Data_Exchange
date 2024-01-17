-- Drop the existing adsb_messages table if it exists to avoid conflicts
DROP TABLE IF EXISTS adsb_messages;

-- Create a new table with a JSONB column to store the entirety of the ADS-B message data in a non-relational format
CREATE TABLE adsb_messages (
    message_id SERIAL PRIMARY KEY,               -- A unique identifier for each message, automatically incrementing.
    message_data JSONB NOT NULL,                 -- The entire ADS-B message data stored as a JSONB object.
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- The time the message was recorded, with timezone.
);

-- Create a GIN index on the message_data JSONB column to optimize non-relational queries
CREATE INDEX idx_adsb_messages_data ON adsb_messages USING GIN (message_data);

