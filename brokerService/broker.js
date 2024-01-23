// Import required libraries and modules
<<<<<<< brokerService/broker.js
=======
const express = require('express')
const proxy = require('express-http-proxy')
const http = require('http')
const bodyParser = require('body-parser') // Middleware for parsing HTTP request bodies
const pgp = require('pg-promise')() // PostgreSQL database library
const cors = require('cors') // Cross-Origin Resource Sharing middleware

const WebSocket = require('ws') // WebSocket setup for ADS-B
>>>>>>> brokerService/broker.js

// Define user service and oauth service urls for proxy service
let user = 'http://localhost:3001';
let auth = 'http://localhost:3002';

// Define the server's port number and database connection URI
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database';

// Create an Express application
<<<<<<< brokerService/broker.js
=======
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())
>>>>>>> brokerService/broker.js

// Enable Cross-Origin Resource Sharing (CORS) and parse JSON data from request bodies
app.use(cors());
app.use(bodyParser.json());

// Establish a connection to the PostgreSQL database
<<<<<<< brokerService/broker.js

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let data = JSON.parse(message);
        console.log('Received message:', data);

        // Inserting messages into the database
        db.none('INSERT INTO adsb_messages(message_data, timestamp) VALUES($1, NOW())', [data])
            .then(() => {
                console.log('Message successfully inserted into database');
            })
            .catch(err => {
                console.error('Error inserting message into database:', err);
            });
    });
});
=======
const db = pgp(DB_URI)

// Forward API call to the appropriate service
app.all("/users/*", proxy(user))
app.all("/auth/*", proxy(auth))

app.get('/groundstation/websocket', (req, res) =>
{
    const ws = new WebSocket('ws://localhost:3000')
})

>>>>>>> brokerService/broker.js

// Handle WebSocket upgrade requests
app.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// GET route to fetch messages from the database
app.get('/message', async (req, res) => {
    try {
        const messages = await db.any('SELECT * FROM adsb_messages');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).send("Error fetching messages: " + err);
    }
<<<<<<< brokerService/broker.js

=======
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
    console.log('undefined route in broker service')
    res.status(404).send("Could not find resource!")
})
>>>>>>> brokerService/broker.js

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Broker service running on port ${PORT}`);
});

// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    pgp.end();  // Close the database connection
    process.exit(0);
});
