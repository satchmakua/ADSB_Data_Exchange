// Import required libraries and modules
const express = require('express')
const proxy = require('http-proxy')
const http = require('http')
const bodyParser = require('body-parser') // Middleware for parsing HTTP request bodies
const pgp = require('pg-promise')() // PostgreSQL database library
const cors = require('cors') // Cross-Origin Resource Sharing middleware

const WebSocket = require('ws') // WebSocket setup for ADS-B

// Define user service and oauth service urls for proxy service
let user = 'http://localhost:3001'
let auth = 'http://localhost:3002'

// Define the server's port number and database connection URI
const PORT = process.env.PORT || 3000 // Use the specified port or default to 3000
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database'

// Create an Express application
const app = express()
const proxyService = proxy.createProxyServer()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Use the body-parser middleware to parse JSON data from request bodies
app.use(bodyParser.json())

// Establish a connection to the PostgreSQL database
const db = pgp(DB_URI)

// Forward API call to the appropriate service
app.all("/usr/*", function (req, res)
{
    proxyService.web(req, res, { target: user })
    // TO DO: Will this automagically return a response to the client?
})

app.all("/auth/*", function (req, res)
{
    proxyService.web(req, res, { target: auth })
    // TO DO: Will this automagically return a response to the client?
})

app.get('/groundstation/websocket', (req, res) =>
{
    const ws = new WebSocket('ws://localhost:3000')
})

wss.on('connection', function connection(ws)
{
    ws.on('message', function incoming(message)
    {
        let data = JSON.parse(message)

        // TO DO: feed incoming messages into database
        console.log((data.messageData).toString(16))
        console.log(data.timeStamp)
    })
})

// Handle WebSocket upgrade requests
app.on('upgrade', (request, socket, head) =>
{
    wss.handleUpgrade(request, socket, head, (ws) =>
    {
        wss.emit('connection', ws, request)
    })
})

/*
Pushing messages onto the database should be done in the websocket connection above

// Route to handle POST requests to store messages in the database
app.post('/message', async (req, res) =>
{
    const { content, groundStationId } = req.body
    try
    {
        await db.none('INSERT INTO messages(content, timestamp, groundStationId) VALUES($1, NOW(), $2)', [content, groundStationId])
        res.status(201).send("Message stored!")
    } catch (err)
    {
        res.status(500).send("Error storing message: " + err)
    }
})
*/

// Route to handle GET requests to fetch messages from the database
app.get('/message', async (req, res) =>
{
    try
    {
        const messages = await db.any('SELECT * FROM messages')
        res.status(200).json(messages)
    } catch (err)
    {
        res.status(500).send("Error fetching messages: " + err)
    }
})

// Placeholder routes for subscribing and unsubscribing (TODO: Implement logic)
app.post('/subscribe', async (req, res) =>
{
    const { subscriberId, topic } = req.body
    // TODO: Logic to add the topic to the subscriber's list of subscriptions
    res.status(200).send("Subscribed successfully!")
})

app.post('/unsubscribe', async (req, res) =>
{
    const { subscriberId, topic } = req.body
    // TODO: Logic to remove the topic from the subscriber's list of subscriptions
    res.status(200).send("Unsubscribed successfully!")
})

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

// Start the server and listen on the specified port
server.listen(PORT, () =>
{
    console.log(`Broker service running on port ${PORT}`)
})

// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function ()
{
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
    pgp.end()  // Close the database connection
    process.exit(0)
})
