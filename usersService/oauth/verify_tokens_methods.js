const axios = require('axios')

const { URI_auth_code } = require('./URI')




async function get_auth_code(user)
{
   try
   {
      const token = (await axios.post(URI_auth_code, user)).headers
      if (token.auth_code === undefined) throw "Error: authentication cannot be generated!"

      return token.auth_code
   } catch (e)
   {
      throw { code: 400, message: e }
   }
}




module.exports = {
   get_auth_code,
}