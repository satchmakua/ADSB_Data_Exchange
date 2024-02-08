const express = require('express')
const router = express.Router()

const {
   postLogin,
   postLogout,
   postCallback,
   postRefresh,
} = require('../controllers/oauth_controller')

//router.post('/auth/register', postRegister)
router.post('/auth/login', postLogin)
router.post('/auth/callback', postCallback)
/* require search function */
router.post('/auth/logout', postLogout)
router.post('/auth/refresh', postRefresh)

module.exports = router