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

   // To Do: Decript and validate password.

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