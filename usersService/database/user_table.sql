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
	id serial PRIMARY KEY,
	user_id int,
	mac_address text UNIQUE,
	latitude int,
	longitude int,
   FOREIGN KEY(user_id) REFERENCES users(id)
) WITH (OIDS = FALSE);