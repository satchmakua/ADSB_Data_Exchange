
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const path = require('path')




async function genAuthTokens (user, client)
{
    // need to search in db for user and get hex value of id
    await client.query('BEGIN')

    const id = ( await client.query(`SELECT id FROM users WHERE username = '${user.username}';`) )[0]['id'].toString(16)
    const access = 'auth'
    const token = jwt.sign(
    {
        _id: id, 
        access
    }, 
    process.env.JWT_SECRET).toString()
    
    await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user.username}';`)
    await client.query('COMMIT')
    return token

}

/* generate auth code */
async function genOAuthCode (user, client /* will need to add param for project */)
{
    const id = ( await client.query(`SELECT id FROM users WHERE username = '${user}';`) )[0]['id'].toString(16)
    const access = 'oauth'
    const token = jwt.sign(
        {
            access,
            _id: id, 
            /* also add information about our project or specifically what they want to access */
        },
        process.env.JWT_SECRET).toString()

    await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user}';`)
    await client.query('COMMIT')
    return token
}


/* exchange access token for oauth code */
async function genAccessToken (user, client /* will need to add param for project */)
{
    const id = ( await client.query(`SELECT id FROM users WHERE username = '${user}';`) )[0]['id'].toString(16)
    const access = 'access_token'
    const token = jwt.sign(
        {
            access,
            _id: id, 
            /* also add information about our project or specifically what they want to access */
        },
        process.env.JWT_SECRET).toString()

    await client.query(`UPDATE users SET access='${access}', token='${token}' WHERE username='${user}';`)
    await client.query('COMMIT')
    return token
}

/* find user by token */
async function findUserByToken (client, token, access)
{
    let decoded;
    try
    {
        decoded = jwt.verify( token, process.env.JWT_SECRET )
    }
    catch (e)
    {
        return Promise.reject(
            {
                code: 401, 
                message: 'invalid code',
            })
    }

    const user = await client.query(`SELECT id FROM users WHERE id=${decoded._id}, token=${token}, access=${access};`)

    return {
        decoded,
        user,
    }
}

/* future implementation */
async function findUserByCredentials (client, email, password)
{
    const user = ( await client.query(`SELECT * FROM users WHERE email='${email}';`) )[0]
    if ( !user )
    {
        return Promise.reject(
            {
                code: 400,
                message: 'Invalid Credentials', 
            }
        )
    }

    return new Promise( function( resolve, reject )
    {
        bcrypt.compare( password, user.password, function ( err, res ) 
        {
         
         resolve(user) /* password not hashed yet */
            // if (res)
            // {
            //     resolve(user)
            // }
            // else
            // {
            //     reject()
            // }
        })
    })


}


async function removeToken(user, client)
{
    /* set up a notification if failed */
    await client.query(`UPDATE users SET token='', access='' WHERE username='${user}';`)
    return await client.query('COMMIT') /* might have to modify route so it is always successful */
}


async function createUser(username, email, password, client)
{
   //await client.query('BEGIN')

   await client.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`)
   await client.query('COMMIT')
}




module.exports = {
    genAuthTokens,
    genOAuthCode,
    genAccessToken,
    findUserByToken,
    findUserByCredentials,
    removeToken,
    createUser,
}
