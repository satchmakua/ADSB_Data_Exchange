/*
   The purpose of this file is to provide functions to decode a users authentication
   code, access token, and refresh token with a secret key.
   
   TODO: Store the secret of each user in the database and retrieve it here
   TODO: For more security, build a nested token structure. The first layer
   is a generic token that will hold information to decode the second token.
   ex.
   generic_token_layer1: 
      {
         generic_token: <token>,
         username: <username>

      }

   In this example, the generic_token_layer1 will be decrypted by a secret key 
   that is only know to sagetech but used for the first layer of every user. 
   The username (or some other unique information) will then be searched in a 
   hash map, which you can use to retrieve the unique secret keys for that user.
   I am not sure if this is oauth but it would create a safer token exchange system.

    NOTE: The big assumption from this file is that the data is correct and from
    a truted source. These functions DO NOT check the data. They only decrypt
    each token (i.e. verify the token) and send the token data to the
    requester (i.e. sagetech (never the user client)).
*/


const { error } = require("console")
const jwt = require("jsonwebtoken")




async function verify_auth_code(user)
{
   /* 
      This function verifies (i.e. can decode) the authentication code.
      Two possilble errors from decoding: 1) token has expired, 2) wrong 
      token.

      @param user: json containing authentication code
   */
   try
   {
      const data = jwt.verify(user.auth_code, process.env.JWT_SECRET)
      return data
   } catch (e)
   {
      return false
   }
}


async function verify_access_token(user)
{
   /* 
      This function verifies (i.e. can decode) the access token.
      Two possilble errors from decoding: 1) token has expired, 2) wrong 
      token.

      @param user: json containing access token
   */
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
   /* 
      This function verifies (i.e. can decode) the refresh token.
      Two possilble errors from decoding: 1) token has expired, 2) wrong 
      token.
      
      @param user: json containing refresh token
   */
   try
   {
      const data = jwt.verify(user.refresh_token, process.env.JWT_SECRET3)
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
