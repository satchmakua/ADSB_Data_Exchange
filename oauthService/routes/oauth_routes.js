const express = require('express')
const router = express.Router()

/* retrieve middleware to checks user input at each endpoint */
const {
   setup_auth_code,
   setup_auth_token,
   setup_refresh_token,
   setup_verify,
} = require('../middleware/uri_setup')

/* Retrieve URI endpoints */
const {
   postAuthCode,
   postLogin,
   postRefresh,
   postVerifyToken,
} = require('../controllers/oauth_controller')



/* URI to generate an authentication code */
router.post('/auth/auth_code', setup_auth_code, postAuthCode)

/* URI to generate an access token */
router.post('/auth/login', setup_auth_token, postLogin)

/* URI to generate a refresh token */
router.post('/auth/refresh', setup_refresh_token, postRefresh)

/* URI to verify any token */
router.post('/auth/verify', setup_verify, postVerifyToken)




module.exports = router