// Import required libraries and modules
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser') // Middleware for parsing HTTP request bodies
const pgp = require('pg-promise')() // PostgreSQL database library
const cors = require('cors') // Cross-Origin Resource Sharing middleware
const users = require('./routes/users') // User-related routes
const oauth = require('./routes/oauth') // OAuth routes

// Define the server's port number and database connection URI
const PORT = process.env.PORT || 3000 // Use the specified port or default to 3000
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database'

// WebSocket setup for ADS-B
const WebSocket = require('ws')

// Create an Express application
const app = express()

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Use the body-parser middleware to parse JSON data from request bodies
app.use(bodyParser.json())

// Establish a connection to the PostgreSQL database
const db = pgp(DB_URI)

// Define routes and route handlers
app.use('/users', users)
app.use('/oauth', oauth)

app.get('/groundstation/websocket', (req, res) =>
{
    const ws = new WebSocket('ws://localhost:3000')
})

app.get('/client/websocket', (req, res) => {
    const clientws = new WebSocket('ws://localhost:3001')
})

wss.on('connection', function connection(ws)
{
    ws.on('message', function incoming(message)
    {
        let data = JSON.parse(message)

        // TO DO: feed incoming messages into database
        //console.log(data.messageData)
        //console.log(data.timeStamp)
        clientws.send(data.messageData)
        clientws.send(data.timestamp)
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
