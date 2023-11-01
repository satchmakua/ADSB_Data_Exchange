const express = require('express');
const { getAdsbMessages, registerAdsbClient } = require('../controllers/adsb_controller');

const router = express.Router();

router.get('/messages', getAdsbMessages);
router.post('/register', registerAdsbClient);

module.exports = router;
