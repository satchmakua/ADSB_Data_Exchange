-- Drop the existing adsb_messages table if it exists
DROP TABLE IF EXISTS adsb_messages;

-- Create the adsb_messages table
CREATE TABLE adsb_messages (
    message_id SERIAL PRIMARY KEY,
    message_data JSONB NOT NULL,
    timestamp TIMESTAMP NOT NULL
);
