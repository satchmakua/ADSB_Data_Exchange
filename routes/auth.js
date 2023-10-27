const express = require('express');
const router = express.Router();

const {
    postLogin,
    postLogout,
    postRefresh,
} = require('../controllers/auth_controller');

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/refresh', postRefresh);

module.exports = router;