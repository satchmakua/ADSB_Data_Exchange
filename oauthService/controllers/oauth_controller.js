
const R = require('ramda')

/* verify auth tokens */
/* middlewares*/
const {
   genAuthTokens,
   genOAuthCode,
   genAccessToken,
   removeToken,
   removeAuthCode,
} = require('../methods/oauth_methods')

const client = require('../database/db.js')




/* Function for handling OAuth login */
postLogin = async (req, res) =>
{
   // const body = R.pick(['email', 'password'], req.body) /* or username? */
   const body = R.pick(['id'], req.body)
   /* verify access token */
   try 
   {
      //const user = await findUserByCredentials(client, body.email, body.password)
      // const token = await genAuthTokens(user, client)
      // res.header('x-auth', token).send(R.pick(['username'], user))
      const token = await genAccessToken(body, client) // make refresh token 
      res.header('x-auth', token).json(
         {
            code: 200,
            message: 'succeeded',
         })
   }
   catch (e)
   {
      console.log(e)
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }

}


/* Function for handling OAuth logout */
postLogout = async (req, res) =>
{ /* DELETE since getting deleting token and access */
   //const body = R.pick(['username'], req.body)
   const body = R.pick(['id', 'token'], req.body)
   //removeToken(body.username, client/*req.token*/).then(
   removeToken(body, client).then(
      res.status(200).json(
         {
            'code': 200,
            'message': 'succeeded',
         })
   ).catch((e) =>
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   })
}


/* Function for refreshing OAuth tokens */
postRefresh = (req, res) =>
{
   // get id and refresh token 
   /* delete old token */
   /* create new access and refresh token */
   /* return access, refresh, and time created */
   res.status(200).json({ "oauth": "token refreshed" })
}


/* Function for handling OAuth callback */
postCallback = (req, res) =>
{
   res.status(200).json({ "oauth": "callback" })
}





module.exports = {
   //postRegister,
   postLogin,
   postRefresh,
   postLogout,
   postCallback,
}
