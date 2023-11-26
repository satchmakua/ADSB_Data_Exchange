
const R = require('ramda')

/* verify auth tokens */
/* middlewares*/
const  {
    genAuthTokens,
    genOAuthCode,
    genAccessToken,
    findUserByToken,
    removeToken,
} = require('../methods/oauth_methods')




/* Function for registering */
postRegister = (req, res) =>
{
    const body = R.pick( ['name', 'email', 'password'], req.body )
    try
    {
        /* need to create a new user */
        const token = genAuthTokens( body.name, client )
        res.header( 'x-auth', token ).send( body.name )

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
    const body = R.pick( ['email', 'password'], req.body )
    try 
    {
        const user  = await findUserByCredentials( client, body.email, body.password )
        const token = await genAuthTokens( user, client )
        res.header( 'x-auth', token ).send( R.pick( ['name'], user ) )
    }
    catch ( e )
    {
        res.status(400).json(
            { 
                code: 400, 
                message: e,
            }) 
    }
    //console.log("OAuth login route hit") 
    //res.status(200).json({ "oauth": "login" }) 
}


/* Function for handling OAuth logout */
postLogout = async (req, res) =>
{
    req.user.removeToken( req.token ).then(
        res.status(200).json(
            { 
                'code': 200,
                'message': 'logout successful',
            }).catch( ( e ) =>
            {
                res.status(400).json(
                    { 
                        code: 400, 
                        message: e,
                    }) 
            })
    ) 
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
    postLogin,
    postRefresh,
    postLogout,
    postCallback,
}
