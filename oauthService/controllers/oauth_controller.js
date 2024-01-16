
const R = require('ramda')

/* verify auth tokens */
/* middlewares*/
const  {
    genAuthTokens,
    genOAuthCode,
    genAccessToken,
    findUserByToken,
    findUserByCredentials,
    removeToken,
    createUser,
} = require('../../methods/oauth_methods')

const client  = require('../../database/db.js')




/* Function for registering */
postRegister = async (req, res) =>
{
   const body = R.pick( ['username', 'email', 'password'], req.body )
   try
    {
      const user = await createUser(body.username, body.email, body.password, client)
      const token = await genAuthTokens( user, client )
      await res.header( 'x-auth', token ).send( body.name )
    }
    catch ( e )
    {
        res.status(400).send(
            {
                code: 400,
                message: e,
            }
        )
    }
}


/* Function for handling OAuth login */
postLogin = async (req, res) =>
{
    const body = R.pick( ['email', 'password'], req.body ) /* or username? */
    try 
    {
        const user  = await findUserByCredentials( client, body.email, body.password )
        const token = await genAuthTokens( user, client )
        res.header( 'x-auth', token ).send( R.pick( ['username'], user ) )
    }
    catch ( e )
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
    const body = R.pick(['username'], req.body)
    removeToken( body.username, client/*req.token*/ ).then(
        res.status(200).json(
            { 
                'code': 200,
                'message': 'logout successful',
            })
            ).catch( ( e ) =>
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
    res.status(200).json({ "oauth": "token refreshed" })
}


/* Function for handling OAuth callback */
postCallback = (req, res) =>
{
    res.status(200).json({ "oauth": "callback" }) 
}





module.exports = {
   postRegister,
    postLogin,
    postRefresh,
    postLogout,
    postCallback,
}
