
const R = require('ramda')

/* methods for creating/removing tokens */
const {
   genOAuthCode,
   genAccessToken,
   genRefreshToken,
} = require('../methods/oauth_gen_token.js')
// const {
//    removeToken,
//    removeAuthCode,
// } = require('../methods/oauth_remove_token.js')
const {
   verify_token
} = require('../methods/auth_verify.js')

const client = require('../database/db.js')




postAuthCode = async (req, res) =>
{
   try 
   {
      const token = await genOAuthCode(req.body, client)
      res.header("auth_code", token).json(
         {
            code: 200,
            message: "success",
         })
   }
   catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }
}


postLogin = async (req, res) =>
{
   try 
   {
      const body = R.pickAll(["auth_code", "scope", "username"], req.body)
      if (!body.auth_code) throw "Error: auth_code was not found!";
      if (!body.scope) throw "Error: Header is missing user data!"

      body['access_t'] = '20m' /* access token max time limit */
      body['access_r'] = '60m' /* refresh token max time limit */

      const token =
         [
            await genAccessToken(body, client),
            await genRefreshToken(body, client)
         ]

      res.status(200).set(
         {
            access_token: token[0],
            refresh_token: token[1],
         }).json(
            {
               code: 200,
               message: "success",
            })
   }
   catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }
}



/* Function for refreshing OAuth tokens */
postRefresh = async (req, res) =>
{
   try 
   {
      const body = R.pickAll(["username", "access", "scope"], req.body)
      if (!body.username) throw "Error: username was not provided!"
      if (!body.scope) throw "Error: access or scope is missing!"

      body['access_t'] = '20m' /* access token max time limit */
      body['access_r'] = '60m' /* refresh token max time limit */

      const token =
         [
            await genAccessToken(body, client),
            await genRefreshToken(body, client)
         ]

      res.status(200).set(
         {
            access_token: token[0],
            refresh_token: token[1],
         }).json(
            {
               code: 200,
               message: "tokens refreshed"
            })
   } catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e
         })
   }
}


postVerifyToken = async (req, res) =>
{
   // To Do: Retrieve refresh-token
   const body = {
      "auth_token": req.get("auth_token")
   }

   const verification = await verify_token(body, client)
   if (verification.code === 400)
   {
      res.status(400).json(verification)
      return
   }

   // To Do: Check verification.code for new tokens generated token 
   // else  if {}
   else
   {
      // do i need to readd old tokens to header? if so might not need (else if {})
      res.header('auth_token', body["auth_token"]).json(
         {
            code: 200,
            message: "success",
         })
   }
}




module.exports = {
   postAuthCode,
   postLogin,
   postRefresh,
   postVerifyToken,
}