DROP TABLE IF EXISTS auth;
DROP TABLE IF EXISTS oauth;

-- make storage for logs
-- ex. userId, encryptedToken, timeCreated, status, reasonForRequest, scope, lifespan, (transponderId or region)

-- access token table
CREATE TABLE auth
(
	userId serial PRIMARY KEY, -- maybe other identifier
	accessToken text, -- delete
	refreshToken text, -- encrypted
   createdAT timestamp NOT NULL default current_timestamp
) WITH (OIDS = FALSE);

-- access code table
CREATE TABLE oauth
(
	userId serial PRIMARY KEY, -- or other identifier
	authCode text
) WITH (OIDS = FALSE);

-- access postgres
-- sudo -u sage psql -d AUTH_TOKENS


-- CREATE TABLE users
-- (
-- 	id serial PRIMARY KEY,
-- 	username text UNIQUE,
-- 	email text UNIQUE,
-- 	password text,
-- 	createdAT timestamp NOT NULL default current_timestamp,
-- 	access text,
-- 	token  text 
-- ) WITH (OIDS = FALSE);

--INSERT INTO users (username, email, password) VALUES ('alex', 'alex@wsu.edu', '3124');
