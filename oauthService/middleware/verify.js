const jwt = require("jsonwebtoken")
const R = require('ramda')




async function verify_auth_code(req, res, next)
{
   try
   {
      const body = R.pickAll(['username'], req.body)
      if (!body.username) throw "Error: Header is missing user data!"

      body['access'] = '3m'

      req.body = body
      next()
   } catch (e)
   {
      res.status(400).json({ code: 400, message: e })
   }
}




module.exports = {
   verify_auth_code,
}