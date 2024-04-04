const pgp = require('pg-promise')({})
const path = require('path')
require('dotenv').config
   ({
      override: true,
      path: path.join(__dirname, '../../dev.env')
   })

const client = pgp({
   user: process.env.ADSDB_USER,
   host: process.env.ADSDB_HOST,
   database: process.env.ADSDB_DB,
   password: process.env.ADSDB_PASSWORD,
   port: process.env.ADSDB_PORT
   // user: process.env.USER,
   // host: process.env.HOST,
   // database: process.env.DB_USER,
   // password: process.env.PASSWORD_USER,
   // port: process.env.DBPORT
});

module.exports = client