/*
   This file provides middleware that checks if user input exists. Also,
   it setups user permissions and replaces the content of the old body 
   from the user request.

   TODO: Modify verify_scope() to take into consideration the type of token
   that is being generated. This will decrease the permission each token has 
   access to.
*/

const jwt = require("jsonwebtoken")
const R = require('ramda') // rambda provides some methods that imitate functional programing       
                           // rambda is not required, it is just something I was testing


const {
   verify_scope,
} = require('../methods/auth_scope')
// const { func } = require("../database/db")




async function setup_auth_code(req, res, next)
{
   /*
      This function checks if the correct user data exist in order to later
      generate an authentication code.
   */
   try
   {
      const body = R.pickAll(['username'], req.body) // only required user data to create auth code
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
    /*
      This function checks if the correct user data exist in order to later
      generate an access token.
   */
   try
   {
      const body = R.pickAll(["username", "scope"], req.body)
      if (!body.scope || !body.username) throw "Error: Header is missing user data!"

      const scope_time = verify_scope(body.scope) /* retrieve user permissions */

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
   /*
      This function checks if the correct user data exist in order to later
      generate a refresh token.
   */
   try
   {
      const body = R.pickAll(["username", "scope"], req.body)
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
   /*
      This function checks that a token exists in order to later verify that
      token.
   */
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