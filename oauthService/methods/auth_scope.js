
async function verify_scope(s)
{
   switch (s)
   {
      case "admin":
         return true
      case "user":
         return true
      default:
         return false
   }
}

module.exports = verify_scope