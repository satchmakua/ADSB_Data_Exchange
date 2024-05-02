
/* Import required libraries and modules */
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config
   ({
      override: true,
      path: path.join(__dirname, 'dev.env')
   })

const PORT = process.env.PORT || 3001

const app = express()
app.use(bodyParser.json())

/* login/register URI */
const user_config = require('./routes/users_login_route')
app.use('/users', user_config)

/* API calls to oauth service */
const verify_users = require('./oauth/verify_route')
app.use(verify_users)

/* User routes */
// Warning: verify_tokens applies to any other defined '/users' route from this point
// If you need to create new URI's, define them before this point
const users = require('./routes/users_route')
const { verify_tokens } = require('./oauth/verify_tokens_middleware')
app.use('/users', verify_tokens, users)


// Error handling middleware for server errors
app.use((err, req, res, next) => 
{
   console.error('server error ', err.stack)
   res.status(500).send('Something went wrong!')
})

// 404 catch-all handler for handling undefined routes
app.use((req, res, next) => 
{
   console.log('undefined route in user service');
   res.status(404).send("Could not find resource!")
})

const http = require('http')
const server = http.createServer(app)
server.listen(PORT, () => 
{
   console.log(`Users service running on port ${PORT}`)
})

// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function () 
{
   console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
   // might need to close db connection? We should never have it open for the whole session?....
   process.exit(0)
})
