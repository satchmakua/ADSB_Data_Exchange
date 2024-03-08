const axios = require('axios')

const URI = 'http://localhost:3000/auth'




postLoginExchange = async (req, res) =>
{
   try 
   {
      const tokens = (await axios.post((URI + '/login'), req.body)).headers
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
   try 
   {
      const tokens = (await axios.post((URI + '/refresh'), req.body)).headers
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