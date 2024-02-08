const { error } = require("console")
const jwt = require("jsonwebtoken")

// generate secret password: require('crypto').randomBytes(64).toString('hex')
async function verify_user(req, res, next)
{
   const token = req.get('x-auth')
   /*  gotta check if undefined */
   try
   {
      const payload = jwt.verify(token, process.env.JWT_SECRET)

      /* if either is not present but there is a refresh token then ask oauth for new token pair */
      // if (!payload._id) // check if in user micro service
      // if (payload.access) //check if access token is in db
      //  maybe check for scope of access
      console.log("Success: token verified -> ", token)
      next()

   } catch (e)
   {
      throw new Error(e)
   }
}

module.exports = verify_user
