/*
   This file provides middleware that verifies or checks the user input before
   reaching the URI endpoint.

   TODO: In verify_tokens(), you should rewrite it so this function does not
         renew the access and refresh tokens. It should return false instead.
*/
const jwt = require("jsonwebtoken")
const R = require('ramda')
const axios = require('axios')
const { verify } = require("crypto")

const { URI_verify, URI_refresh } = require('./URI')




async function request_auth_code_verification(req, res, next)
{
   /*
      This function verifies the auth_code (i.e. decrypts token) and passes
      the information stored in the token to the URI endpoint.
   */
   try
   {
      /* get auth code from request header */
      const body = { auth_code: req.get("auth_code") }
      if (body.auth_code === undefined) throw "authentication code is undefined!"

      /* verify token */
      const message = (await axios.post(URI_verify, body)).data.message
      if (message.auth_code === false) throw "authentication code cannot be verified"

      /* modify request body */
      message.auth_code["scope"] = req.body.scope
      req.body = message.auth_code

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}


async function verify_tokens(req, res, next)
{
    /*
      This function verifies the access and refresh tokens (i.e. decrypts token).
   */
   try
   {
      /* verify access token */
      const body1 = { access_token: req.get("access_token") }
      if (body1.access_token === undefined) throw "Error: access token is undefined!"

      const message = (await axios.post(URI_verify, body1)).data.message

      /* if access token failed, check refresh token... */
      if (message.access_token === false)
      {
         const body2 = { refresh_token: req.get("refresh_token") }
         if (body2.refresh_token === undefined) throw "Error: refresh token is undefined!"

         const msg = (await axios.post(URI_verify, body2)).data.message
         if (msg.refresh_token === false) throw "Error: refresh token cannot be verified"

         /* create new token if access token is invalid */
         // you should probably not do this
         // Also, this functionality means that after every call to oauth the client should
         // check if new_tokens parameter is true or not. This tells the client if they need
         // a new token
         const tokens = (await axios.post(URI_refresh, msg.refresh_token)).headers
         res["new_tokens"] =
         {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
         }
      }
      else
      {
         res["new_tokens"] = false
      }

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}


async function request_refresh_token_verification(req, res, next)
{
   /*
      This function verifies the refresh token (i.e. decrypts token) and passes
      the information stored in the token to the URI endpoint.
   */
   try
   {
      const body = { refresh_token: req.get("refresh_token") }
      if (body.refresh_token === undefined) throw "refresh token is undefined!"

      const message = (await axios.post(URI_refresh, body)).data.message
      if (message.refresh_token === false) throw "refresh token cannot be verified"

      req.body = message.refresh_token

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}




module.exports = {
   request_auth_code_verification,
   verify_tokens,
   request_refresh_token_verification
}

