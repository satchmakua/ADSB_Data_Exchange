const getAdsbMessages = (req, res) => {
    res.status(200).json({"adsb": "messages"});
}

const registerAdsbClient = (req, res) => {
    // Extract client details from request body
    const { clientName, clientDetails } = req.body;

    // Assume a dummy registration logic for demo
    console.log(`Client ${clientName} registered with details: ${JSON.stringify(clientDetails)}`);

    // Send a response back
    res.status(200).json({ status: 'Client registered successfully' });
}

module.exports = {
    getAdsbMessages,
    registerAdsbClient
}

module.exports = {
    getAdsbMessages,
    registerAdsbClient
}
