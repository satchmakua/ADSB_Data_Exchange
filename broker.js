const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const cors = require('cors');
const auth = require('./routes/auth');
const users = require('./routes/users');
const oauth = require('./routes/oauth'); 
const adsb = require('./routes/adsb');

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database'; 
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = pgp(DB_URI);

app.use('/auth', auth);
app.use('/users', users);
app.use('/oauth', oauth); 
app.use('/adsb', adsb);

wss.on('connection', (ws) => {
    console.log('Client connected to ADS-B WebSocket');

    // For demonstration purposes, let's send a welcome message
    ws.send(JSON.stringify({ message: 'Welcome to ADS-B WebSocket' }));
});

app.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.post('/message', async (req, res) => {
    const { content, groundStationId } = req.body;
    try {
        await db.none('INSERT INTO messages(content, timestamp, groundStationId) VALUES($1, NOW(), $2)', [content, groundStationId]);
        res.status(201).send("Message stored!");
    } catch (err) {
        res.status(500).send("Error storing message: " + err);
    }
});

app.get('/message', async (req, res) => {
    try {
        const messages = await db.any('SELECT * FROM messages');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).send("Error fetching messages: " + err);
    }
});

app.post('/subscribe', async (req, res) => {
    const { subscriberId, topic } = req.body;
    // TODO: Logic to add the topic to the subscriber's list of subscriptions
    res.status(200).send("Subscribed successfully!");
});

app.post('/unsubscribe', async (req, res) => {
    const { subscriberId, topic } = req.body;
    // TODO: Logic to remove the topic from the subscriber's list of subscriptions
    res.status(200).send("Unsubscribed successfully!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// 404 catch-all handler
app.use((req, res, next) => {
    res.status(404).send("Could not find resource!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Broker service running on port ${PORT}`);
});

// Gracefully shut down on SIGINT
process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    pgp.end();  // Close the database connection
    process.exit(0);
});
