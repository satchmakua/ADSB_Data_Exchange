// Broker Component - ADS-B Restful Data Exchange

// Import required libraries and modules
const express = require('express')
const proxy = require('express-http-proxy')
const http = require('http')
const bodyParser = require('body-parser') // Middleware for parsing HTTP request bodies
const pgp = require('pg-promise')() // PostgreSQL database library
const cors = require('cors') // Cross-Origin Resource Sharing middleware

const WebSocket = require('ws') // WebSocket setup for ADS-B


// Function to help troubleshoot db connection issues
function logDbConnectionDetails(db) {
    db.connect()
        .then(obj => {
            console.log('Connected to the database:', db.$config.options)
            obj.done() // release the connection
        })
        .catch(error => {
            console.error('Error connecting to the database:', error)
        })
}

// Define user service and oauth service urls for proxy service
let user = 'http://localhost:3001'
let auth = 'http://localhost:3002'

// Define the server's port number and database connection URI
const PORT = process.env.PORT || 3000
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database'
const db = pgp(DB_URI)
logDbConnectionDetails(db)

// Create an Express application
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Enable Cross-Origin Resource Sharing (CORS) and parse JSON data from request bodies
app.use(cors())
app.use(bodyParser.json())

// Establish a connection to the PostgreSQL database

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let data = JSON.parse(message)
        console.log('Received message:', data)

        // Inserting messages into the database
        db.none('INSERT INTO adsb_messages(message_data, timestamp) VALUES($1, NOW())', [data])
            .then(() => {
                console.log('Message successfully inserted into database')
            })
            .catch(err => {
                console.error('Error inserting message into database:', err)
            })
    })
})

// Middleware to authenticate WebSocket connections
wss.on('connection', (ws, req) => {
    // Placeholder for authentication check, e.g., via token in query params
    const token = req.url.split('token=')[1]; // Simplified example
    if (!token || token !== 'expectedToken') {
        ws.terminate(); // Close connection if not authenticated
        console.log('WebSocket connection closed due to failed authentication');
    }
});

// Forward API call to the appropriate service
app.all("/users/*", proxy(user))
app.all("/auth/*", proxy(auth))

app.get('/groundstation/websocket', (req, res) =>
{
    const ws = new WebSocket('ws://localhost:3000')
})


// Handle WebSocket upgrade requests
app.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
    })
})

// GET route to fetch messages from the database
app.get('/message', async (req, res) => {
    try {
        const messages = await db.any('SELECT * FROM adsb_messages')
        res.status(200).json(messages)
    } catch (err) {
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

// Actual implementation for subscription management
const subscriptions = {}; // Simplified example to keep track of subscriptions

app.post('/subscribe', (req, res) => {
    const { subscriberId, topic } = req.body;
    if (!subscriptions[subscriberId]) {
        subscriptions[subscriberId] = new Set();
    }
    subscriptions[subscriberId].add(topic);
    console.log(`Subscriber ${subscriberId} added to topic ${topic}`);
    res.status(200).json({ message: `Subscribed to topic ${topic}` });
});

app.post('/unsubscribe', (req, res) => {
    const { subscriberId, topic } = req.body;
    if (subscriptions[subscriberId] && subscriptions[subscriberId].has(topic)) {
        subscriptions[subscriberId].delete(topic);
        console.log(`Subscriber ${subscriberId} removed from topic ${topic}`);
        res.status(200).json({ message: `Unsubscribed from topic ${topic}` });
    } else {
        res.status(404).json({ message: `Subscription not found for topic ${topic}` });
    }
});

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

// Middleware for logging request details
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`);
    next();
});

// 404 catch-all handler for handling undefined routes
app.use((req, res, next) =>
{
    console.log('undefined route in broker service')
    res.status(404).send("Could not find resource!")
})

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Broker service running on port ${PORT}`)
})

db.connect()
  .then(obj => {
      console.log('Connected to the database')
      obj.done() // success, release the connection
  })
  .catch(error => {
      console.log('ERROR:', error.message || error)
  })

console.log(`Database URI: ${DB_URI}`)

// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
    pgp.end()  // Close the database connection
    process.exit(0)
})

// Clean shutdown logic for WebSocket server
const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('HTTP server closed.');
        wss.close(() => {
            console.log('WebSocket server closed.');
            pgp.end().then(() => {
                console.log('Database connections closed.');
                process.exit(0);
            });
        });
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

