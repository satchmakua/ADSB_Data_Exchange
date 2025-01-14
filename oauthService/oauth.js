
const express = require('express')
const bodyParser = require('body-parser')
// const path = require('path')
// require('dotenv').config(
//    {
//       override: true,
//       path: path.join(__dirname, '../dev.env')
//    })



const PORT = process.env.PORT || 3002


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next)
{
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
const oauth = require('./routes/oauth_routes')
app.use(oauth)

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



// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function () 
{
   console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
   // might need to close db connection? We should never have it open for the whole session?....
   process.exit(0)
})
