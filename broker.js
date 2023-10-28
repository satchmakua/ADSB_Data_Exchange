const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const cors = require('cors');

// Constants
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'postgresql://postgres:sagetech123@localhost:5432/database'; 

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = pgp(DB_URI);

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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Broker service running on port ${PORT}`);
});

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    pgp.end();
    process.exit(0);
});
