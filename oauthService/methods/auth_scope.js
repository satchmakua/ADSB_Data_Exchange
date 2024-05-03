/*
   This file verifys what scope (i.e. what type of access the user has
   to Sagetech's resources). Currently verify_Scope() is only defining
   how long users can access sagetechs resources.
   
   TODO: define other valid scope
   TODO: define other permissions a valid scope can give
   TODO: scope should be stored in the user service and sent to this service
*/
function verify_scope(s)
{
   /*
      This function check if the user scope is valid and gives appropriet
      infomration to create the auth code and refresh token.
      @param 's': string containing the scope access that the user has
   */
   const body = {}
   switch (s)
   {
      case 'admin':
         body['access_t'] = '30m' /* total time access token is valid  */
         body['access_r'] = '60m' /* total time refresh token is valid */
         return body
      case 'user':
         body['access_t'] = '20m'
         body['access_r'] = '60m'
         return body
      default:
         throw `${s} is an invalid scope!`
   }
}




module.exports = { verify_scope }