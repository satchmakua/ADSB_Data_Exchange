const axios = require('axios');
const brokerUri = 'http://localhost:3000';  // URI of the broker server

async function fetchAdsbMessages() {
    try {
        const response = await axios.get(`${brokerUri}/message`);
        console.log('ADS-B Messages:', response.data);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

fetchAdsbMessages();
