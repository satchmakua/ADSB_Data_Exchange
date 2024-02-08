const jwt = require("jsonwebtoken")




async function removeToken(user, client)
{
   /* set up a notification if failed */
   try
   {
      await client.query(`DELETE FROM auth WHERE userId='${user.id}' AND accessToken='${user.token}';`)
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

   await client.query(`DELETE FROM oauth WHERE userId='${user.id}' AND authCode='${user.token}';`)
   return await client.query('COMMIT') /* might have to modify route so it is always successful */
}




module.exports = {
   removeToken,
   removeAuthCode,
}