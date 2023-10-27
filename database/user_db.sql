DROP TABLE IF EXISTS auth;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id serial PRIMARY KEY,
	UNIQUE username text,
	password text
) WITH (OIDS = FALSE);

CREATE TABLE devices
(
	user_id serial,
	device text,
    FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY(user_id, device)
) WITH (OIDS = FALSE);

CREATE TABLE auth
(
	user_id serial,
	access_token text,
	refresh_token text,
	FOREIGN KEY(user_id) REFERENCES users(id)
) WITH (OIDS = FALSE);

SELECT * from users;
SELECT * from auth;