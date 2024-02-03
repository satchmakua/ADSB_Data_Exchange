
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const path = require('path')




async function genAuthTokens(user, client)
{
   /* same access token but without scope */
   if (user == undefined)
   {
      return undefined /* throw error */
   }

   // try
   // {
   //    await client.one(`SELECT * FROM users WHERE username="${user.username}" AND id=${user.id};`)

   // } catch (e)
   // {
   //    console.log(e)
   //    return undefined;
   // }

   //await client.query('BEGIN')

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

   //await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user}';`)
   await client.query(`INSERT INTO oauth (userId, authCode) VALUES ('${id}', '${token}')`)
   await client.query('COMMIT')
   return token
}


/* exchange access token for oauth code */
async function genAccessToken(user, client /* will need to add param for project */)
{
   // const id = user.id
   // const access = 'access_token'
   // const token = jwt.sign(
   //    {
   //       access,
   //       _id: id,
   //       /* also add information about our project or specifically what they want to access */
   //    },
   //    process.env.JWT_SECRET).toString()

   // await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user}';`)
   // await client.query('COMMIT')
   // return token

   /* requires scope if you wanna have admin,user, etc */
   if (user == undefined)
   {
      return undefined /* throw error */
   }
   console.log(user)
   const id = user.id;
   const access = 'access_token'
   const scope = 'ADMIN' /* probably send from user microservice  */
   const token = jwt.sign(
      {
         _id: id,
         access
      },
      'hello').toString()

   await client.query(`INSERT INTO auth (userId, accessToken, refreshToken) VALUES ('${id}', '${token}', 'NOT IMPLEMENTED YET')`)
   await client.query('COMMIT')
   /* need to return time created */
   return token
}

/* find user by token */
// async function findUserByToken(client, token, access)
// {
//    let decoded;
//    try
//    {
//       decoded = jwt.verify(token, process.env.JWT_SECRET)
//    }
//    catch (e)
//    {
//       return Promise.reject(
//          {
//             code: 401,
//             message: 'invalid code',
//          })
//    }

//    const user = await client.query(`SELECT id FROM users WHERE id=${decoded._id}, token=${token}, access=${access};`)

//    return {
//       decoded,
//       user,
//    }
// }

/* future implementation */
// async function findUserByCredentials(client, email, password)
// {
//    const user = (await client.query(`SELECT * FROM users WHERE email='${email}';`))[0]
//    if (!user)
//    {
//       return Promise.reject(
//          {
//             code: 400,
//             message: 'Invalid Credentials',
//          }
//       )
//    }

//    return new Promise(function (resolve, reject)
//    {
//       bcrypt.compare(password, user.password, function (err, res) 
//       {

//          resolve(user) /* password not hashed yet */
//          // if (res)
//          // {
//          //     resolve(user)
//          // }
//          // else
//          // {
//          //     reject()
//          // }
//       })
//    })
// }


async function removeToken(user, client)
{
   /* set up a notification if failed */
   //await client.query(`UPDATE users SET token='', access='' WHERE username='${user}';`)
   await client.query(`DELETE FROM auth WHERE userId='${user.id}' AND accessToken='${user.token}';`)
   return await client.query('COMMIT') /* might have to modify route so it is always successful */
}


async function removeAuthCode(user, client)
{
   /* set up a notification if failed */

   await client.query(`DELETE FROM oauth WHERE userId='${user.id}' AND authCode='${user.token}';`)
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
   // findUserByToken,
   // findUserByCredentials,
   removeToken,
   removeAuthCode,
   // createUser,
}
