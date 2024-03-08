const jwt = require("jsonwebtoken")
const R = require('ramda')
const axios = require('axios')

const URI = 'http://localhost:3000/auth'




async function request_auth_code_verification(body)
{
   try
   {
      // const body = { auth_code: req.get("auth_code") }
      if (body.auth_code === undefined) throw "authentication code is undefined!"

      const message = (await axios.post((URI + '/verify'), body)).data.message
      if (message.auth_code === false) throw "authentication code cannot be verified"

      //next()
      return true
   } catch (e)
   {
      throw { code: 400, message: e }
   }

}


async function request_access_token_verification(req)
{
   try
   {
      //const body = { access_token: req.get("access_token") }
      if (body.access_token === undefined) throw "access token is undefined!"

      const message = (await axios.post((URI + '/verify'), body)).data.message
      if (message.access_token === false) throw "access token cannot be verified"

      //next()
      return true
   } catch (e)
   {
      throw { code: 400, message: e }
   }

}


async function request_refresh(body)
{
   try
   {
      //const body = { refresh_token: req.get("refresh_token") }
      if (body.refresh_token === undefined) throw "refresh token is undefined!"

      const message = (await axios.post((URI + '/refresh'), body)).data.
         console.log(message)

      res.status(200).set(
         {
            access_token: token[0],
            refresh_token: token[1],
         }).json(
            {
               code: 200,
               message: "success"
            })
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }
}




module.exports = {
   request_auth_code_verification,
   request_refresh
}