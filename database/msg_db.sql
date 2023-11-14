-- Remove the existing adsb_messages table if it already exists to avoid conflicts.
DROP TABLE IF EXISTS adsb_messages;

-- Create a new table to store ADS-B messages with appropriate data types and constraints.
CREATE TABLE adsb_messages (
	 message_id SERIAL PRIMARY KEY,               -- A unique identifier for each message, automatically incrementing.
	 icao_address CHAR(6) NOT NULL,               -- The 24-bit ICAO address assigned to each aircraft, fixed length.
	 call_sign VARCHAR(8),                        -- The call sign for the aircraft, variable length.
	 altitude INTEGER,                            -- The altitude of the aircraft in feet.
	 latitude DOUBLE PRECISION,                   -- The latitude of the aircraft in decimal degrees.
	 longitude DOUBLE PRECISION,                  -- The longitude of the aircraft in decimal degrees.
	 vertical_rate INTEGER,                       -- The rate of climb or descent in feet per minute.
	 ground_speed INTEGER,                        -- The speed of the aircraft over the ground in knots.
	 track_angle INTEGER,                         -- The track angle of the aircraft in degrees.
	 timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- The time the message was recorded, with timezone.
	 message_data BYTEA NOT NULL                  -- The raw message data in binary format.
);

   
-- Create an index to optimize queries filtering by the timestamp, improving the speed of time-based retrievals.
CREATE INDEX idx_adsb_messages_timestamp ON adsb_messages(timestamp);
