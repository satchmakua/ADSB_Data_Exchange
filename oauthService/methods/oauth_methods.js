
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const path = require('path')



/* prob dont need only difference with access token is the scope */
async function genAuthTokens(user, client)
{
   /* same access token but without scope */
   if (user == undefined)
   {
      return undefined /* throw error */
   }

   const id = user.id;
   const access = 'auth-token'

   const token = jwt.sign(
      {
         _id: id,
         access
      },
      process.env.JWT_SECRET).toString()
      
   //await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user.username}';`)
   await client.query(`INSERT INTO auth (userId, accessToken, refreshToken) VALUES ('${id}', '${token}', 'NOT IMPLEMENTED YET')`)
   await client.query('COMMIT')
   /* need to return time created */
   return token

}

/* generate auth code */
async function genOAuthCode(user, client /* will need to add param for project */)
{
   const id = user.id
   const access = 'oauth'
   const token = jwt.sign(
      {
         _id: id,
         access,
         /* also add information about our project or specifically what they want to access */
      },
      process.env.JWT_SECRET).toString()

   const query = {
      text: 'INSERT INTO oauth (userId, authCode) VALUES ("$1", "$2")',
      values: [id, token]
   }
   //await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user}';`)
   await client.query(query)
   await client.query('COMMIT')
   return token
}


/* exchange access token for oauth code */
async function genAccessToken(user, client /* will need to add param for project */)
{
   /* requires scope if you wanna have admin,user, etc */
   if (user == undefined)
   {
      return undefined /* throw error */
   }

   const id = user.id;
   const access = 'access_token'
   const scope = 'ADMIN' /* probably send from user microservice  */
   const payload = {
      _id: id,
      access
   }
   const options = {
      expiresIn: "20m"
   }
   const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      options
   ).toString()

   const query = {
      text: "INSERT INTO auth (userId, accessToken, refreshToken) VALUES ('$1', '$2', 'NOT IMPLEMENTED YET')",
      values: [id, token]
   }

   await client.query(query)
   await client.query('COMMIT')
   /* need to return time created */
   return token
}


async function removeToken(user, client)
{
   /* set up a notification if failed */
   //await client.query(`UPDATE users SET token='', access='' WHERE username='${user}';`)
   try
   {
      const query = {
         text: "DELETE FROM auth WHERE userId='$1' AND accessToken='$2';",
         values: [user.id, user.token]
      }
      await client.query(query)
      await client.query('COMMIT')
      return {
         'code': 200,
         'message': 'Successfully deleted token'
      }
   } catch (e)
   {
      return {
         'code': 400,
         'message': 'Error deleting token'
      }
   }
}


async function removeAuthCode(user, client)
{
   /* set up a notification if failed */
   const query = {
      text: "DELETE FROM oauth WHERE userId='$1' AND authCode='$2';",
      values: [user.id, user.token]
   }
   await client.query(query)
   return await client.query('COMMIT') /* might have to modify route so it is always successful */
}






// async function createUser(username, email, password, client)
// {
//    //await client.query('BEGIN')

//    await client.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`)
//    const user = await client.query(`SELECT * FROM users WHERE username='${username}';`)
//    await client.query('COMMIT')


//    return user
// }




module.exports = {
   genAuthTokens,
   genOAuthCode,
   genAccessToken,
   removeToken,
   removeAuthCode,
}
