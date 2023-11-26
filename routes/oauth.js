const express = require('express')
const router = express.Router()

const {
   postRegister,
   postLogin,
   postLogout,
   postCallback,
   postRefresh,
} = require('../controllers/oauth_controller')

router.post('/register', postRegister)
router.post('/login', postLogin)
router.post('/callback', postCallback)
/* maybe delete for logout */
router.post('/logout', postLogout)
router.post('/refresh', postRefresh)

module.exports = router