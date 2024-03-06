
function verify_scope(s)
{
   const body = {}
   switch (s)
   {
      case 'admin':
         body['access_t'] = '30m'
         body['access_r'] = '60m'
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