const jwt = require("jsonwebtoken")




/* generate auth code */
async function genOAuthCode(user, client)
{
   try 
   {
      if (!user) return undefined /* throw error */

      const payload = { "username": user.username, }
      const options = { expiresIn: user.access, }//"3m"
      const token = jwt.sign(payload, process.env.JWT_SECRET, options).toString()

      const query = {
         text: "INSERT INTO oauth (userId, authCode) VALUES ($1, $2)",
         values: [user.username, token]
      }

      await client.query(query)
      await client.query('COMMIT')

      return token
   }
   catch (e) 
   {
      return e
   }
}


/* exchange access token for oauth code */
async function genAccessToken(user, client)
{
   try
   {
      if (!user) throw "User data is not found!"

      //const body = jwt.verify(user.auth_code, process.env.JWT_SECRET) // will need to move bc it does not fit this function

      const payload =
      {
         "username": user.username,
         "scope": user.scope
      }
      const options = { expiresIn: user.access }//"20m"
      const token = jwt.sign(payload, process.env.JWT_SECRET2, options).toString()

      const query = {
         text: "INSERT INTO auth (userId, accessToken, refreshToken) VALUES ($1, $2, 'NOT IMPLEMENTED YET')",
         values: [user.username, token]
      }

      await client.query(query)
      await client.query('COMMIT')

      return token
   } catch (e)
   {
      return e
   }
}


async function genRefreshToken(user, client)
{
   try
   {
      if (!user) throw "User data is not found!";

      // const body = jwt.verify(user.auth_token, JWT_SECRET2);
      const payload =
      {
         username: user.username,
         scope: user.scope
      }
      const options = { expiresIn: user.access }
      const token = jwt.sign(payload, process.env.JWT_SECRET3, options)

      return token

   } catch (e)
   {
      return e
   }
}




module.exports = {
   genOAuthCode,
   genAccessToken,
   genRefreshToken,
}
