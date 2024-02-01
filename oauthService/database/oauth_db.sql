DROP TABLE IF EXISTS auth;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id serial PRIMARY KEY,
	username text UNIQUE,
	email text UNIQUE,
	password text,
	createdAT timestamp NOT NULL default current_timestamp,
	-- might need to make array since a user might have multiple tokens
	access text,
	token  text 
) WITH (OIDS = FALSE);

--INSERT INTO users (username, email, password) VALUES ('alex', 'alex@wsu.edu', '3124');

CREATE TABLE auth
(
	userId serial PRIMARY KEY,
	accessToken text,
	refreshToken text,
   createdAT timestamp NOT NULL default current_timestamp,
	--FOREIGN KEY(user_id) REFERENCES users(id)
) WITH (OIDS = FALSE);

CREATE TABLE oauth
(
	userId serial PRIMARY KEY,
	authCode text,
	--FOREIGN KEY(userId) REFERENCES users(id)
) WITH (OIDS = FALSE);
-- SELECT * from users;
-- SELECT * from auth;
-- sudo -u sage psql -d AUTH_TOKENS