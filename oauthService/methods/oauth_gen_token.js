const jwt = require("jsonwebtoken")




/* generate auth code */
async function genOAuthCode(user, client /* will need to add param for project */)
{
   if (!user)
   {
      return undefined /* throw error */
   }

   const payload =
   {
      "username": user.username,
   }
   const options =
   {
      expiresIn: user.access,//"3m"
   }

   const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      options).toString()

   const query = {
      text: "INSERT INTO oauth (userId, authCode) VALUES ($1, $2)",
      values: [id, token]
   }

   await client.query(query)
   await client.query('COMMIT')

   return token
}


/* exchange access token for oauth code */
async function genAccessToken(user, client)
{
   if (!user)
   {
      return undefined /* throw error */
   }

   /* will have to move in the future */
   try
   {
      const body = jwt.verify(user.auth_code, process.env.JWT_SECRET) // will need to move bc it does not fit this function

      const payload =
      {
         "username": body.username,
         "scope": user.scope
      }
      const options =
      {
         expiresIn: user.access//"20m"
      }
      const token = jwt.sign(
         payload,
         process.env.JWT_SECRET2,
         options
      ).toString()

      const query = {
         text: "INSERT INTO auth (userId, accessToken, refreshToken) VALUES ($1, $2, 'NOT IMPLEMENTED YET')",
         values: [id, token]
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
   if (!user)
   {
      return undefined
   }

   return "7"
}




module.exports = {
   genOAuthCode,
   genAccessToken,
}
