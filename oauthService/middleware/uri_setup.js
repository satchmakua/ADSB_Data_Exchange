const jwt = require("jsonwebtoken")
const R = require('ramda')

const {
   verify_scope,
} = require('../methods/auth_scope')
const { func } = require("../database/db")




async function setup_auth_code(req, res, next)
{
   try
   {
      const body = R.pickAll(['username'], req.body)
      if (!body.username) throw "Error: Header is missing user data!"

      body['access'] = '3m' /* auth code max time limit */

      req.body = body

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }
}


async function setup_auth_token(req, res, next)
{
   try
   {
      const body = R.pickAll([/*"auth_code", "refresh_token",*/ "username", "scope"], req.body)
      //if (!body.auth_code && !body.refresh_token) throw "Error: auth code or refresh token are not found!"
      if (!body.scope || !body.username) throw "Error: Header is missing user data!"

      const scope_time = verify_scope(body.scope)

      body['access_t'] = scope_time.access_t /* access token max time limit */
      body['access_r'] = scope_time.access_r /* refresh token max time limit */

      req.body = body

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}


async function setup_refresh_token(req, res, next)
{
   try
   {
      const body = R.pickAll([/*"refresh_token",*/ "username", "scope"], req.body)
      //if (!body.refresh_token) throw "Error: refresh token is not found!"
      if (!body.scope || !body.username) throw "Error: Header is missing user data!"

      const scope_time = verify_scope(body.scope)

      body['access_t'] = scope_time.access_t /* access token max time limit */
      body['access_r'] = scope_time.access_r /* refresh token max time limit */

      req.body = body

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}

async function setup_verify(req, res, next)
{
   /* tokens will come from header */
   //const body = { "auth_token": req.get("auth_token") }

   try
   {
      const body = R.pickAll(['auth_code', 'access_token', 'refresh_token'], req.body)
      if (!body.auth_code && !body.access_token && !body.refresh_token) throw 'No auth token is found!'

      req.body = body

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}



module.exports = {
   setup_auth_code,
   setup_auth_token,
   setup_refresh_token,
   setup_verify,
}