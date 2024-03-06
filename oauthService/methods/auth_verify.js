const { error } = require("console")
const jwt = require("jsonwebtoken")




async function verify_auth_code(user)
{
   try
   {
      const data = jwt.verify(user.access_code, process.env.JWT_SECRET)
      return data
   } catch (e)
   {
      return false
   }
}


async function verify_access_token(user)
{
   try
   {
      const data = jwt.verify(user.access_token, process.env.JWT_SECRET2)
      return data
   } catch (e)
   {
      return false
   }
}


async function verify_refresh_token(user)
{
   try
   {
      const data = jwt.verify(user.refresh_token, process.env.JWT_SECRET2)
      return data
   } catch (e)
   {
      return false
   }
}




module.exports =
{
   verify_auth_code,
   verify_access_token,
   verify_refresh_token,
}
