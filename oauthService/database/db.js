/*
   This file contains the setup for the database. Each file that requires
   access to the oauth database will import this file.

   Note: the database is currently NOT being used in my oauth implementation.
   Look at oauth_db.js for possible tables that you might want in the future.
*/
const pgp = require('pg-promise')({})
const path = require('path')
require('dotenv').config
   ({
      override: true,
      path: path.join(__dirname, '../../dev.env')
   })

const client = pgp({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DB_AUTH,
   password: process.env.PASSWORD_AUTH,
   port: process.env.DBPORT
});

module.exports = client