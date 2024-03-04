const readline = require('readline');
const WebSocket = require('ws');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ws = new WebSocket('ws://ec2-instance-public-dns:3000');

ws.on('open', function open() {
    console.log('Connected to the WebSocket server');
    interactWithWebSocket();
});

ws.on('message', function incoming(data) {
    console.log('Received: %s', data);
});

ws.on('close', function close() {
    console.log('Disconnected from the WebSocket server');
    process.exit(0);
});

function interactWithWebSocket() {
    rl.question('Enter command (subscribe/unsubscribe/fetchMessages) or "exit" to quit: ', (command) => {
        if (command === 'exit') {
            ws.close();
        } else {
            ws.send(JSON.stringify({ action: command }));
            interactWithWebSocket();
        }
    });
}

process.on('SIGINT', function() {
    console.log('Disconnecting...');
    ws.close();
});
