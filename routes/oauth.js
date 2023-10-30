const express = require('express');
const { oauthLogin, oauthCallback, oauthLogout, oauthRefresh } = require('../controllers/oauth_controller');

const router = express.Router();

router.get('/login', oauthLogin);
router.get('/callback', oauthCallback);
router.get('/logout', oauthLogout);
router.get('/refresh', oauthRefresh);

module.exports = router;