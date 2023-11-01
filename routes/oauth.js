const express = require('express');
const router = express.Router();

const {
    postLogin,
    postLogout,
    postRefresh,
} = require('../controllers/auth_controller');

router.get('/login', oauthLogin);
router.get('/callback', oauthCallback);
router.get('/logout', oauthLogout);
router.get('/refresh', oauthRefresh);

module.exports = router;