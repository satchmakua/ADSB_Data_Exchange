const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = 3000;
const MONGO_URI = 'mongo_connection_string_here';

const app = express();
app.use(bodyParser.json());

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
});
const Message = mongoose.model('Message', messageSchema);

// Simple in-memory PubSub
const topics = {};

const pubsub = {
    subscribe: (topic, listener) => {
        if (!topics[topic]) topics[topic] = [];
        topics[topic].push(listener);
    },
    publish: (topic, data) => {
        if (!topics[topic]) return;
        topics[topic].forEach(listener => listener(data));
    }
};

// When a new message is stored, publish it
app.post('/message', (req, res) => {
    const newMessage = new Message({
        content: req.body.content,
        groundStationId: req.body.groundStationId
    });
    
    newMessage.save()
        .then(() => {
            pubsub.publish('newMessage', newMessage);
            res.status(201).send("Message stored!");
        })
        .catch(err => res.status(500).send("Error storing message:", err));
});

// Example: a simple subscriber that logs all new messages
pubsub.subscribe('newMessage', (message) => {
    console.log(`Received new message from ${message.groundStationId}: ${message.content}`);
});

app.get('/message', (req, res) => {
    Message.find()
        .then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).send("Error fetching messages:", err));
});

app.listen(PORT, () => {
    console.log(`Broker service running on port ${PORT}`);
});
