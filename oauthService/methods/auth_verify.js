const { error } = require("console")
const jwt = require("jsonwebtoken")




// generate secret password: require('crypto').randomBytes(64).toString('hex')
async function verify_user(user, client)
{
   /*  To Do: Check if user undefined */

   // To Do: Check for access token and if it can be decrypted
   try
   {
      const payload = jwt.verify(user["auth-token"], process.env.JWT_SECRET)

      console.log("Success: access token verified. Payload: ", payload)

   } catch (e)
   {
      // To Do: Check for refresh token and generate new token pair if valid
      // otherwise throw error
      try
      {
         const payload = jwt.verify(user["refresh-token"], process.env.JWT_SECRET)
         console.log("Success: refresh token verified. Payload: ", payload)
      } catch (e2)
      {
         //throw new Error(e2)
         return {
            "code": 400,
            "message": "Could not refresh tokens"
         }
      }
   }

   // To Do (?): Should we check user db for user info? 
   //    - prob not since we are the only person who should be able to decode the msg

   return {
      "code": 200,
      "message": "We should return a proper success or error and tokens"
   }
}




module.exports = { verify_user }
