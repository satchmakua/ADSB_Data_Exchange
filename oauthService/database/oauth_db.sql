DROP TABLE IF EXISTS auth;
DROP TABLE IF EXISTS oauth;


-- access token table
CREATE TABLE auth
(
	userId serial PRIMARY KEY,
	accessToken text,
	refreshToken text,
   createdAT timestamp NOT NULL default current_timestamp
) WITH (OIDS = FALSE);

-- access code table
CREATE TABLE oauth
(
	userId serial PRIMARY KEY,
	authCode text,
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
