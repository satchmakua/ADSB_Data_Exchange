const express = require('express')
const router = express.Router()

const {
   postLoginExchange,
   postRefreshTokens,
} = require('./verify_controllers')
const {
   request_auth_code_verification,
   request_refresh_token_verification,
} = require('./verify_tokens_middleware')




/* request for the first access and refresh tokens */
router.post('/users/tokens/login', request_auth_code_verification, postLoginExchange)

/* request for tokens to be refreshed */
router.post('/users/tokens/refresh', request_refresh_token_verification, postRefreshTokens)






module.exports = router