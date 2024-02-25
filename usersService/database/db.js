const pgp = require('pg-promise')({})
const path = require('path')
require('dotenv').config
   ({
      override: true,
      path: path.join(__dirname, '../dev.env')
   })

const client = pgp({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DB_USER,
   password: process.env.PASSWORD_USER,
   port: process.env.DBPORT
});

module.exports = client