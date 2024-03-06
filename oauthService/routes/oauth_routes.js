const express = require('express')
const router = express.Router()

const {
   setup_auth_code,
   setup_auth_token,
   setup_refresh_token,
   setup_verify,
} = require('../middleware/setup')
const {
   postAuthCode,
   postLogin,
   postRefresh,
   postVerifyToken,
} = require('../controllers/oauth_controller')
const {
   postUserLogin,
   postUserLogout
} = require('../controllers/temp_login_logout')




router.post('/auth/auth_code', setup_auth_code, postAuthCode)
router.post('/auth/login', setup_auth_token, postLogin)
router.post('/auth/refresh', setup_refresh_token, postRefresh)
router.post('/auth/verify', setup_verify, postVerifyToken)

/* require search function */

/* temp user login */
router.post('/auth/temp_login', postUserLogin)
router.post('/auth/temp_logout', postUserLogout)




module.exports = router