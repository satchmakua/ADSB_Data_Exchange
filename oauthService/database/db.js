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
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.DBPORT
});

module.exports = client