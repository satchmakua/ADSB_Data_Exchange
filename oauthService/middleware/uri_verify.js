const jwt = require("jsonwebtoken")
const R = require('ramda')
const axios = require('axios')

const URI = 'http://localhost:3000/auth'




async function request_auth_code_verification(req, res, next)
{
   try
   {
      const token = req.get("auth_code")
      const body = { auth_code: token }
      const request = await axios.post((URI + '/verify'), body)
      console.log(request)
      console.log('done')
      //throw 'Error: Done!'
      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}


async function request_access_token_verification(req, res, next)
{
   try
   {
      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}


async function request_refresh_token_verification(req, res, next)
{
   try
   {
      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }

}




module.exports = {
   request_auth_code_verification,
   request_access_token_verification,
   request_refresh_token_verification,
}

