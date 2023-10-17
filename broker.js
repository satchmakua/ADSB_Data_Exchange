const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');  // If we decide to handle CORS

// Constants
const PORT = process.env.PORT || 3000;  // Using environment variable or default
const MONGO_URI = process.env.MONGO_URI || 'mongo_connection_string_here';

const app = express();
app.use(bodyParser.json());
app.use(cors());  // If we decide to handle CORS

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    groundStationId: {
        type: String,
        required: true
    }
    // TODO: Additional fields
});
const Message = mongoose.model('Message', messageSchema);

app.post('/message', (req, res) => {
    // TODO: Validate message content

    const newMessage = new Message(req.body);
    newMessage.save()
        .then(() => res.status(201).send("Message stored!"))
        .catch(err => res.status(500).send("Error storing message:", err));
});

app.get('/message', (req, res) => {
    // TODO: Filter based on subscriptions
    Message.find()
        .then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).send("Error fetching messages:", err));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`
Broker service running on port ${PORT}`);
});

// TODO: Define subscription routes and logic

// Allow users or ground stations to subscribe to certain topics/messages
app.post('/subscribe', (req, res) => {
    const { subscriberId, topic } = req.body;
    
    // TODO: Logic to add the topic to the subscriber's list of subscriptions
    
    res.status(200).send("Subscribed successfully!");
});

// Allow users or ground stations to unsubscribe from certain topics/messages
app.post('/unsubscribe', (req, res) => {
    const { subscriberId, topic } = req.body;

    // TODO: Logic to remove the topic from the subscriber's list of subscriptions

    res.status(200).send("Unsubscribed successfully!");
});

// ... additional routes and logic as needed

// Optional: Graceful shutdown on signals like SIGINT, SIGTERM etc.
process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    
    // Close MongoDB connection, etc.
    mongoose.connection.close().then(() => {
        process.exit(0);
    });
});
