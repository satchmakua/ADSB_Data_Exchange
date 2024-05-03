/*
   This file provides URI endpoints in the user microservice to request 
   for access and refresh tokens from the oauth server.

   Assumption: This file does not verify the user content. It only generates
   each token.
*/
const axios = require('axios')

const { URI_login, URI_refresh } = require('./URI')




postLoginExchange = async (req, res) =>
{
   /*
      This function request for the initial access and refresh token from the
      oauth microservice.
   */
   try 
   {
      const tokens = (await axios.post(URI_login, req.body)).headers
      res.status(200).set(
         {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
         }).json(
            {
               code: 200,
               message: "success",
            })
   } catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }
}


postRefreshTokens = async (req, res) =>
{
   /*
      This function refreshes the access and refresh token from the oauth microservice.
   */
   try 
   {
      const tokens = (await axios.post(URI_refresh, req.body)).headers
      res.status(200).set(
         {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
         }).json(
            {
               code: 200,
               message: "success",
            })
   } catch (e)
   {
      res.status(400).json(
         {
            code: 400,
            message: e,
         })
   }
}




module.exports =
{
   postLoginExchange,
   postRefreshTokens,
}