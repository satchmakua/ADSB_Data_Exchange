const WebSocket = require('ws');
const axios = require('axios');

const BASE_URL = 'http://localhost:3002'; // Adjusted to use your OAuth service's local address
const userId = parseInt(process.argv[2]);
const deviceId = parseInt(process.argv[3]);

if (isNaN(userId) || isNaN(deviceId)) {
    console.error('Usage: node ws_client.js <userId> <deviceId>');
    process.exit(1);
}

async function getAccessCode() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'admin1',
            password: 'password',
        });
        // Using correct property access according to the expected response format.
        return response.data.token; // Adjusted based on the typical response structure for login.
    } catch (error) {
        console.error('Error fetching access code:', error.message);
        throw error;
    }
}

async function getAuthorizationToken(authCode) {
    try {
        // Assuming this endpoint correctly exchanges an auth code for tokens.
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            auth_code: authCode,
        }, {
            headers: {
                Authorization: `Bearer ${authCode}`, // Assuming auth code is used here directly for simplicity.
            }
        });
        return { accessToken: response.data.access_token, refreshToken: response.data.refresh_token };
    } catch (error) {
        console.error('Error fetching authorization token:', error.message);
        throw error;
    }
}

async function main() {
    try {
        const { accessToken, refreshToken } = await getAuthorizationToken(await getAccessCode());

        // Establish WebSocket connection
        const socket = new WebSocket(`ws://localhost/ws/${userId}`); // Assuming WebSocket service runs on the main host

        socket.on('open', () => {
            console.log('WebSocket connection opened.');
            socket.send(JSON.stringify({ type: 'init', userId }));
        });

        socket.on('message', (data) => {
            console.log('Received message from server:', data);
        });

        socket.on('close', () => {
            console.log('WebSocket connection closed.');
        });

        socket.on('error', (error) => {
            console.error('WebSocket error:', error.message);
        });

        // Demonstrate using accessToken for a protected endpoint if necessary
        // This part depends on your application's requirements
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
