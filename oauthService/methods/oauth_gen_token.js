/*
   This file provides function to generate an authentication code, access token
   and refresh tokens.

   * authentication code: token used to exchange for an access token. User logs in
     and receives authentication code. This is an extra step for extra security.
     https://oauth.net/2/grant-types/authorization-code/ 
   
   * access token: Token used to access sagetech's resources
   
   * refresh token: Token used to renew the access token

   TODO: Use a more secure encryption algorithm
   TODO (maybe): Since middleware verifies data you can assign user
   to payload for each function (remove option data).

   JWT resource: https://www.npmjs.com/package/jsonwebtoken

   NOTE: Rethink if a refresh token is required because I would not trust my
   implementation. An alternate option is to increase the life of the access
   token.
*/
const jwt = require("jsonwebtoken")




/* generate auth code */
async function genOAuthCode(user, client)
{
   /*
      This function generate an authentication code using the passed in information
      (i.e. user).

      @param user: json of user permision and options
      @param client: postgress database access
   */
   try 
   {
      if (!user) throw "User data is not found!"

      /* user permisions/info that will be encrypted */
      const payload = { "username": user.username, }
      /* creates an experitation data for token */
      const options = { expiresIn: user.access, }
      /* encrypt payload with JWT_SECRET */
      const token = jwt.sign(payload, process.env.JWT_SECRET, options).toString()

      // example of inserting to db in postgress 
      // const query = {
      //    text: "INSERT INTO oauth (userId, authCode) VALUES ($1, $2)",
      //    values: [user.username, token]
      // }

      // await client.query(query)
      // await client.query('COMMIT')

      return token
   }
   catch (e) 
   {
      throw e
   }
}


/* exchange access token for oauth code */
async function genAccessToken(user, client)
{
   /*
      This function generate an access token using the passed in information
      (i.e. user).

      @param user: json of user permision and options
      @param client: postgress database access
   */
   try
   {
      if (!user) throw "User data is not found!"

      const payload =
      {
         "username": user.username,
         "scope": user.scope
      }
      const options = { expiresIn: user.access_t }
      const token = jwt.sign(payload, process.env.JWT_SECRET2, options).toString()

      // const query = {
      //    text: "INSERT INTO auth (userId, accessToken, refreshToken) VALUES ($1, $2, 'NOT IMPLEMENTED YET')",
      //    values: [user.username, token]
      // }

      // await client.query(query)
      // await client.query('COMMIT')

      return token
   } catch (e)
   {
      throw e
   }
}


async function genRefreshToken(user, client)
{
   /*
      This function generate a refresh token using the passed in information
      (i.e. user).

      @param user: json of user permision and options
      @param client: postgress database access
   */
   try
   {
      if (!user) throw "User data is not found!";

      const payload =
      {
         username: user.username,
         scope: user.scope
      }
      const options = { expiresIn: user.access_r }
      const token = jwt.sign(payload, process.env.JWT_SECRET3, options)

      return token

   } catch (e)
   {
      throw e
   }
}




module.exports = {
   genOAuthCode,
   genAccessToken,
   genRefreshToken,
}
