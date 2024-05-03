/*
   This file contains EXAMPLE client side code for oauth login. This file is never 
   used in my oauth implementation because it was used to imitate an interaction
   with the oauth server from the client side.

   NOTE: Checkout: ../../usersService/oauth/* to see the user API that imitates
   this code. Also, this setup is integrated within the users API.

   NOTE: 100% chance this code does not work because it previous interations of
         my API calls to oauth.
 
   The following is a high level overview of how users should login and 
   interact with oauth.
   Login Procedure:
      1. User sends login/register request to user service.
      2. If successful, the user service will request an authentication code
         from the oauth service.
      3. User will request an access & refresh token from the user service.
         The user service will request an access token by exchanging the 
         authentication code.
      4. User can now use sagetechs resources
   
   TODO: A rule of auth is that the resource and oauth server SHOULD be 
         seperate from each other. This implementation breaks that and 
         should be implemented if ever deployed.
*/
const R = require('ramda')
const axios = require('axios')

const {
   postAuthCode,
   postLogin,
} = require('./oauth_controller.js')

const client = require('../database/db.js')

const uri = 'http://localhost:3002/auth'




postUserLogin = async (req, res) =>
{
   // user log in with credentials
   const body = R.pickAll(["username", "password"], req.body)
   if (!body.username || !body.password)
   {
      res.status(400).json(
         {
            code: 400,
            message: "Missing user value",
         })

      return
   }

   // To Do: Decrypt and validate password.

   // generate auth code
   const authCodeLifespan = "3m"
   const authTokenLifespan = "20m"

   /* Get auth code */
   // To Do: check if authCode is invalid.
   const authCode =
      (await axios.post((uri + '/auth_code'),
         {
            "username": body.username,
            "access": authCodeLifespan
         })
      ).headers["auth-code"]

   // get access token 

   /* Exchange auth code for access token */
   // To Do: Check if authToken is invalid.
   const authToken =
      (await axios.post((uri + '/login'),
         {
            "auth_code": authCode,
            "access": authTokenLifespan,
            "scope": "SCOPE_NOT_IMPLEMENTED"
         })
      ).headers["auth-token"]

   res.header('auth-token', authToken).json(
      {
         code: 200,
         message: "success",
      })

}


postUserLogout = async (req, res) =>
{
   // To Do: Retrieve refresh-token
   // const body = {
   //    "refresh-token": req.get("auth-token")
   // }

   // To Do: Delete encrypted refresh token in auth db?
   res.json(
      {
         code: 200,
         message: "success",
      })

}



module.exports = {
   postUserLogin,
   postUserLogout,
}