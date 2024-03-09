const jwt = require("jsonwebtoken")
const R = require('ramda')
const axios = require('axios')
const { verify } = require("crypto")

const URI = 'http://localhost:3000/auth'




async function request_auth_code_verification(req, res, next)
{
   try
   {
      const body = { auth_code: req.get("auth_code") }
      if (body.auth_code === undefined) throw "authentication code is undefined!"

      const message = (await axios.post((URI + '/verify'), body)).data.message
      if (message.auth_code === false) throw "authentication code cannot be verified"

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
   try
   {
      /* verify access token */
      const body1 = { access_token: req.get("access_token") }

      if (body1.access_token === undefined) throw "Error: access token is undefined!"

      const message = (await axios.post((URI + '/verify'), body1)).data.message

      /* if access token failed, refresh token... */
      if (message.access_token === false)
      {
         const body2 = { refresh_token: req.get("refresh_token") }
         if (body2.refresh_token === undefined) throw "Error: refresh token is undefined!"

         const msg = (await axios.post((URI + '/verify'), body2)).data.message
         if (msg.refresh_token === false) throw "Error: refresh token cannot be verified"

         const tokens = (await axios.post((URI + '/refresh'), msg.refresh_token)).headers
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


// async function request_access_token_verification(req, res, next)
// {
//    try
//    {
//       const body = { access_token: req.get("access_token") }
//       if (body.access_token === undefined) throw "access token is undefined!"

//       const message = (await axios.post((URI + '/verify'), body)).data.message
//       if (message.access_token === false) throw "access token cannot be verified"

//       next()
//    } catch (e)
//    {
//       res.status(400).json({ code: 400, message: e })
//    }

// }


async function request_refresh_token_verification(req, res, next)
{
   try
   {
      const body = { refresh_token: req.get("refresh_token") }
      if (body.refresh_token === undefined) throw "refresh token is undefined!"

      const message = (await axios.post((URI + '/verify'), body)).data.message
      if (message.refresh_token === false) throw "refresh token cannot be verified"

      req.body = message.refresh_token

      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}


// async function request_refresh(req, res, next)
// {
//    try
//    {
//       const body = { refresh_token: req.get("refresh_token") }
//       if (body.refresh_token === undefined) throw "refresh token is undefined!"

//       const message = (await axios.post((URI + '/refresh'), body))
//       #console.log(message)

//       next()
//    } catch (e)
//    {
//       res.status(400).json({ code: 400, message: e })
//    }

// }




module.exports = {
   request_auth_code_verification,
   verify_tokens,
   request_refresh_token_verification
}

