const Pool = require('pg').Pool

// TO-DO: set db up on WSU server and update these settings
const pool = new Pool({
    user: "janna",
    host: "localhost",
    database: "postgres",
    password: "password",
    port: 5432
})

// post '/users'
// create user
postUsers = (req, res) =>
{
    const { username, password } = req.body

    const salt = crypto.randomBytes(32).toString('hex')
    if (password == null || password.length < 1 || username == null || username.length < 1 ) {
        res.status(400).send('username or password not provided.')
        return
    }
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")
 
    pool.query(`INSERT INTO users (username, password, salt) VALUES ('${username}', '${hash}', '${salt}') RETURNING *`, (error, results) =>
    {
        if (error)
        {
            res.status(500).send('User registration failed.')
            return
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
}

// post '/users/validate'
// validate that user login information is correct when user first logs into the application
isValidUser = (req, res) => {
    const {username, password} = req.body;
    let salt = ''

    if (password == null || password.length < 1 || username == null || username.length < 1 ) {
        res.status(400).send('username or password not provided.')
        return
    }

    pool.query(`SELECT salt from users WHERE username='${username}'`, (error, results) => {
        if (error) {
            res.status(500).send('User not found in the system.')
            return
        }
        salt = results.rows[0].salt
    })

    const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")
    
    pool.query(`SELECT id FROM users WHERE username='${username}' AND password='${hash}'`, (error, results) => {
        if (error) {
            res.status(400).send('Invalid Password.')
            return
        }
        res.status(201).send('User Verified.')
    })
}


// get '/users?limit=<param>&start[< "l,g" + "e, ">]=<param>'
// list users with query
// Q: need some explanation on the query?
// the below code will just return ALL users.
getUsers = (req, res) =>
{
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) =>
    {
        if (error)
        {
            res.status(500).send('Unable to retrieve user list.')
            return
        }
        res.status(200).json(results.rows)
    })

}

// get '/users/:id'
// get user given user id
// Q: what should be returned? just username?
getID = (req, res) =>
{
    const id = parseInt(req.params.id)
    pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) =>
    {
        if (error)
        {
            throw error
        }
        res.status(200).json(results.rows)
    })

}

// delete '/users/:id'
// delete user given user id
deleteID = (req, res) =>
{
    const id = parseInt(req.params.id)
    pool.query(`DELETE FROM users WHERE id = ${id}`, (error, results) =>
    {
        if (error)
        {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

// put '/users/:id'
// update user given user id
// Q: just updating password? Option to update username or both?
putID = (req, res) =>
{
    res.status(200).json({})
}

// post '/users/:id/devices'
// input a new device tied to user id
postDevices = (req, res) =>
{
    res.status(200).json({})
}

// get '/users/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>'
// get devices from a user given query
// Q: so this query will only be for a specific user?
getDevices = (req, res) =>
{
    res.status(200).json({})
}

// get '/users/:id/devices/:id'
// get device information given a device ID and user ID
getUserDevices = (req, res) =>
{
    res.status(200).json({})
}

// delete '/users/:id/devices/:id'
// delete a device tied to a specific user
deleteUserDevices = (req, res) =>
{
    res.status(200).json({})
}

// put '/users/:id/devices/:id'
// update a device tied to a specific user
putUserDevices = (req, res) =>
{
    res.status(200).json({})
}

// get 'users/:id/client/connect'
// give client information for websocket connection
getConnect = (req, res) =>
{
    res.status(200).json({})
}

// put 'users/:id/client/disconnect'
// tell broker that client is disconnected
putDisconnect = (req, res) =>
{
    res.status(200).json({})
}

// get '/users/:id/devices/:id/adsb?start=<param>&end=<param>''
// get adsb messages from a to b
getAdsbUserDevices = (req, res) =>
{
    res.status(200).json({})
}

module.exports = {
    postUsers,
    isValidUser,
    getUsers,
    getID,
    deleteID,
    putID,
    postDevices,
    getDevices,
    getUserDevices,
    deleteUserDevices,
    putUserDevices,
    getConnect,
    putDisconnect,
    getAdsbUserDevices,
}