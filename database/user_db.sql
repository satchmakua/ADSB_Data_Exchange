DROP TABLE IF EXISTS clientdevices;
DROP TABLE IF EXISTS groundstations;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id serial PRIMARY KEY,
 	username text UNIQUE,
	password text,
	salt text
) WITH (OIDS = FALSE);

/*
the relation between users and groundstations is one to many,
i.e. a user can have many groundstations but each groundstation should only
be tied to one user. So each ground station will only exist once in this table. 
If this changes, we need to do a join table.
*/
CREATE TABLE groundstations
(
	user_id serial,
	mac_address text UNIQUE,
	location point,
   FOREIGN KEY(user_id) REFERENCES users(id),
   PRIMARY KEY(mac_address)
) WITH (OIDS = FALSE);

/*
we are treating the relation between users and clientdevices as one to many right now, however that may change.
*/
CREATE TABLE clientdevices
(
	user_id serial,
	mac_address text UNIQUE,
	FOREIGN KEY(user_id) REFERENCES users(id),
   PRIMARY KEY(mac_address)
)