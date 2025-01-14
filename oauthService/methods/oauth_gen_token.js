const jwt = require("jsonwebtoken")




/* generate auth code */
async function genOAuthCode(user, client)
{
   try 
   {
      if (!user) throw "User data is not found!"

      const payload = { "username": user.username, }
      const options = { expiresIn: user.access, }
      const token = jwt.sign(payload, process.env.JWT_SECRET, options).toString()

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
