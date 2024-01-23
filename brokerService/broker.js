// Import required libraries and modules
const express = require('express');
const proxy = require('http-proxy');
const http = require('http');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const cors = require('cors');
const WebSocket = require('ws');

// Define user service and oauth service urls for proxy service
let user = 'http://localhost:3001';
let auth = 'http://localhost:3002';

// Define the server's port number and database connection URI
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database';

// Create an Express application
const app = express();
const proxyService = proxy.createProxyServer();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Enable Cross-Origin Resource Sharing (CORS) and parse JSON data from request bodies
app.use(cors());
app.use(bodyParser.json());

// Establish a connection to the PostgreSQL database
const db = pgp(DB_URI);

// Forward API calls to the appropriate service
app.all("/usr/*", (req, res) => {
    proxyService.web(req, res, { target: user });
});

app.all("/auth/*", (req, res) => {
    proxyService.web(req, res, { target: auth });
});

// WebSocket endpoint for ground stations
app.get('/groundstation/websocket', (req, res) => {
    const ws = new WebSocket('ws://localhost:3000');
});

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
});

// Placeholder routes for subscription management
app.post('/subscribe', async (req, res) => {
    // Implement subscription logic here
    res.status(200).send("Subscribed successfully!");
});

app.post('/unsubscribe', async (req, res) => {
    // Implement unsubscription logic here
    res.status(200).send("Unsubscribed successfully!");
});

// Error handling and 404 catch-all handlers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use((req, res, next) => {
    res.status(404).send("Could not find resource!");
});

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
