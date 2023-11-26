
/* Import required libraries and modules */
const express = require('express')
const bodyParser = require('body-parser') 
const path = require('path')
require('dotenv').config
({
      override: true,
      path: path.join(__dirname, 'dev.env')
   })

/* Postgress database */
//const pgp = require('pg-promise')()


/*
async function connection() {
   const db = pgp({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.DBPORT
   });
   return await db.connect()
}*/



//const client = db.connect()
//setTimeout(() => {  console.log('World!'); }, 2000);


/*
const { genAuthTokens } = require('./methods/oauth_methods');
const { none } = require('ramda');
connection().then((obj) => { genAuthTokens('alex', obj)})
*/


const PORT = process.env.PORT || 3000 


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(function (req, res, next) {
   res.setHeader("Access-Control-Allow-Origin", "*")
   res.setHeader("Access-Control-Expose-Headers", "x-auth")
   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
   res.setHeader(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With,content-type, Accept , x-auth"
   )
 
   next()
 })

  /* OAuth routes */
const oauth = require('./routes/oauth') 
app.use('/oauth', oauth)

// Error handling middleware for server errors
app.use((err, req, res, next) => 
{
   console.error(err.stack)
   res.status(500).send('Something went wrong!')
})

// 404 catch-all handler for handling undefined routes
app.use((req, res, next) => 
{
   res.status(404).send("Could not find resource!")
})


const http = require('http');
const server = http.createServer(app);
server.listen(PORT, () => 
{
   console.log(`Oauth service running on port ${PORT}`)
})
// app.listen(PORT, () => 
// {
//    console.log(`Oauth service running on port ${PORT}. Databse listening at ${process.env.DBPORT}`)
// })



// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function () 
{
   console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
   // might need to close db connection? We should never have it open for the whole session?....
   process.exit(0)
})
