/*
   This file provides a function that requests for an auth code from the oauth
   microservice. This function is used in the login uri in the controller
   directory.
*/
const axios = require('axios')

const { URI_auth_code } = require('./URI')




async function get_auth_code(user)
{
   /*
      This function requests an auth code from the oauth microservice.

      @param user: json data required to generate the auth code.
      
      ** Check out the oauth middleware setup_auth_code() for more information.
   */
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