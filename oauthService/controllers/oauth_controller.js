
const R = require('ramda')

/* methods for creating/removing tokens */
const {
   genOAuthCode,
   genAccessToken,
   genRefreshToken,
} = require('../methods/oauth_gen_token.js')
// const {
//    removeToken,
//    removeAuthCode,
// } = require('../methods/oauth_remove_token.js')
const {
   verify_auth_code,
   verify_access_token,
   verify_refresh_token,
} = require('../methods/auth_verify.js')

const client = require('../database/db.js')




postAuthCode = async (req, res) =>
{
   try 
   {
      const token = await genOAuthCode(req.body, client)
      res.header("auth_code", token).json(
         {
            code: 200,
            message: "success",
         })
   }
   catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }
}


postLogin = async (req, res) =>
{
   try 
   {
      const token =
         [
            await genAccessToken(req.body, client),
            await genRefreshToken(req.body, client)
         ]

      res.status(200).set(
         {
            access_token: token[0],
            refresh_token: token[1],
         }).json(
            {
               code: 200,
               message: "success",
            })
   }
   catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }
}



/* Function for refreshing OAuth tokens */
postRefresh = async (req, res) =>
{
   try 
   {
      const token =
         [
            await genAccessToken(req.body, client),
            await genRefreshToken(req.body, client)
         ]

      res.status(200).set(
         {
            access_token: token[0],
            refresh_token: token[1],
         }).json(
            {
               code: 200,
               message: "success"
            })
   } catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e
         })
   }
}


postVerifyToken = async (req, res) =>
{
   try
   {
      const body = req.body

      /* verify auth code */
      if (body.auth_code && !body.access_token && !body.refresh_token) 
      {
         let auth_code = true
         if (await verify_auth_code(body) === false) auth_code = false

         res.status(200).json(
            {
               code: 200,
               message: { auth_code: auth_code }
            })
      }
      /* verify access token */
      else if (!body.auth_code && body.access_token && !body.refresh_token)
      {
         let access_token = true
         if (await verify_access_token(body) === false) access_token = false

         res.status(200).json(
            {
               code: 200,
               message: { 'access_token': access_token }
            })
      }
      /* verify refresh tokens */
      else if (!body.auth_code && !body.access_token && body.refresh_token)
      {
         let refresh_token = true
         if (await verify_refresh_token(body) === false) refresh_token = false

         res.status(200).json(
            {
               code: 200,
               message: { 'refresh_token': refresh_token }
            })
      }
      else throw "Error: User input has too many tokens! Only input 1 token."

   } catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e
         })
   }

}




module.exports = {
   postAuthCode,
   postLogin,
   postRefresh,
   postVerifyToken,
}