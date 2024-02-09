
const R = require('ramda')

/* methods for creating/removing tokens */
const {
   genOAuthCode,
   genAccessToken,
} = require('../methods/oauth_gen_token.js')
const {
   removeToken,
   removeAuthCode,
} = require('../methods/oauth_remove_token.js')
const {
   verify_user
} = require('../methods/auth_verify.js')

const client = require('../database/db.js')




postAuthCode = async (req, res) =>
{
   /* verify user data */
   const body = R.pickAll(['username', 'access'], req.body)
   if (!body.username || !body.access)
   {
      res.status(400).json(
         {
            code: 400,
            message: "Missing user value",
         })

      return
   }

   /* make access token */
   try 
   {
      const token = await genOAuthCode(body, client)
      res.header('auth-code', token).json(
         {
            code: 200,
            message: "success",
         })
   }
   catch (e)
   {
      console.log(e)
      res.status(400).json(
         {
            code: 400,
            message: "Could not generate authentication code",
         })
   }
}


postLogin = async (req, res) =>
{
   /* verify user data */
   const body = R.pickAll(["auth_code", "access", "scope"], req.body)//["username", 'scope', 'access'], req.body)
   if (!body.auth_code || !body.access || !body.scope)//!body.username)
   {
      res.status(400).json(
         {
            code: 400,
            message: "Missing user value",
         })

      return
   }

   /* make access token */
   try 
   {
      const token = await genAccessToken(body, client)
      res.header('auth-token', token).json(
         {
            code: 200,
            message: "success",
         })
   }
   catch (e)
   {
      console.log(e)
      res.status(400).json(
         {
            code: 400,
            message: "Could not generate access Token",
         })
   }

}


postLogout = async (req, res) =>
{
   // const body = R.pickAll(['id', 'token'], req.body)
   // /* need to get token from header */
   // //removeToken(body.username, client/*req.token*/).then(
   // removeToken(body, client).then(
   //    res.status(200).json(
   //       {
   //          'code': 200,
   //     e     'message': 'succeeded',
   //       })
   // ).catch((e) =>
   // {
   //    res.status(400).json(
   //       {
   //          code: 400,
   //          message: e,
   //       })
   // })
}


/* Function for refreshing OAuth tokens */
postRefresh = (req, res) =>
{
   // get id and refresh token 
   /* delete old token */
   /* create new access and refresh token */
   /* return access, refresh, and time created */
   res.status(200).json({ "oauth": "token refreshed" })
}


postVerifyToken = async (req, res) =>
{
   // To Do: Retrieve refresh-token
   const body = {
      "auth-token": req.get("auth-token")
   }

   const verification = await verify_user(body, client)
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
      res.header('auth-token', body["auth-token"]).json(
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
   postLogout,
   postVerifyToken,
}