const express = require('express')
const router = express.Router()

const {
   postAuthCode,
   postLogin,
   postLogout,
   postRefresh,
   postVerifyToken,
} = require('../controllers/oauth_controller')
const {
   postUserLogin,
   postUserLogout
} = require('../controllers/temp_login_logout')




//router.post('/auth/register', postRegister)
router.post('/auth/auth_code', postAuthCode)
router.post('/auth/login', postLogin)
/* require search function */
router.post('/auth/logout', postLogout)
router.post('/auth/refresh', postRefresh)
router.post('/auth/verify', postVerifyToken)

/* temp user login */
router.post('/auth/temp_login', postUserLogin)
router.post('/auth/temp_logout', postUserLogout)




module.exports = router