const WebSocket = require('ws');

// Replace with your WebSocket server URL
const wsUrl = 'ws://localhost:3000/groundstation/websocket';
const ws = new WebSocket(wsUrl);

ws.on('open', function open() {
    console.log('Connected to the server');
    // Optionally send a message to the server
    ws.send('Hello Server');
});

ws.on('message', function incoming(data) {
    console.log('Received data: ', data);
});

ws.on('error', function error(error) {
    console.error('WebSocket error:', error);
});

ws.on('close', function close() {
    console.log('Disconnected from the server');
});
