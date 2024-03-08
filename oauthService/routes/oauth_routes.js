const express = require('express')
const router = express.Router()

const {
   setup_auth_code,
   setup_auth_token,
   setup_refresh_token,
   setup_verify,
} = require('../middleware/uri_setup')
const {
   postAuthCode,
   postLogin,
   postRefresh,
   postVerifyToken,
} = require('../controllers/oauth_controller')




router.post('/auth/auth_code', setup_auth_code, postAuthCode)
router.post('/auth/login', setup_auth_token, postLogin)
router.post('/auth/refresh', setup_refresh_token, postRefresh)
router.post('/auth/verify', setup_verify, postVerifyToken)




module.exports = router