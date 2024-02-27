const jwt = require("jsonwebtoken")




async function removeToken(user, client)
{
   /* set up a notification if failed */
   try
   {
      const query = {
         text: "DELETE FROM auth WHERE userId=$1 AND accessToken=$2",
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

   // await client.query(`DELETE FROM oauth WHERE userId='${user.id}' AND authCode='${user.token}';`)
   // return await client.query('COMMIT') /* might have to modify route so it is always successful */
   const query = {
      text: "DELETE FROM oauth WHERE userId=$1 AND authCode=$2",
      values: [user.id, user.token]
   }
   await client.query(query)
   return await client.query('COMMIT') /* might have to modify route so it is always successful */

}




module.exports = {
   removeToken,
   removeAuthCode,
}