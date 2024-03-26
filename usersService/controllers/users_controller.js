//const Pool = require('pg').Pool
const crypto = require('crypto')

// const pool = new Pool({
//    user: "janna",
//    host: "localhost",
//    database: "postgres",
//    password: "password",
//    port: 5432
// })
const { get_auth_code } = require('../oauth/verify_tokens_methods.js')
const client = require('../database/db.js')
//const { use } = require('../oauth/verify_route.js')


// post '/users'
// create user
postUsers = async (req, res) =>
{
   try
   {
      const { username, password } = req.body

      const salt = crypto.randomBytes(32).toString('hex')
      if (password == null || password.length < 1 || username == null || username.length < 1)
      {
         res.status(400).send('username or password not provided.')
         return
      }
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

      const query = {
         text: "INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *",
         values: [username, hash, salt]
      };

      const results = await client.query(query)
      const token = await get_auth_code({ username }) // dont need token here only create when login?

      res.status(201).header("auth_code", token).send(`User added with ID: ${results[0].id}`)
   } catch (e)
   {
      res.status(500).send('Error: User registration failed.')
   }
   // const { username, password } = req.body

   // const salt = crypto.randomBytes(32).toString('hex')
   // if (password == null || password.length < 1 || username == null || username.length < 1)
   // {
   //    res.status(400).send('username or password not provided.')
   //    return
   // }
   // const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

   // const query = {
   //    text: "INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *",
   //    values: [username, hash, salt]
   // };

   // client.query(query, (error, results) =>
   // {
   //    if (error)
   //    {
   //       res.status(500).send('User registration failed.')
   //       return
   //    }
   //    res.status(201).send(`User added with ID: ${results.rows[0].id}`)
   // })
}

// post '/users/validate'
// validate that user login information is correct when user first logs into the application
isValidUser = async (req, res) =>
{
   try
   {
      const { username, password } = req.body;

      if (password == null || password.length < 1 || username == null || username.length < 1)
      {
         res.status(400).send('username or password not provided.')
         return
      }

      const saltQuery = {
         text: "SELECT salt from users WHERE username=$1",
         values: [username]
      }

      const salt = (await client.query(saltQuery))[0].salt
      if (!salt)
      {
         res.status(500).send('User not found in the system.')
         return
      }

      const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

      const query = {
         text: "SELECT id FROM users WHERE username=$1 AND password=$2",
         values: [username, hash]
      }

      const user = (await client.query(query))[0].id

      if (!user)
      {
         res.status(400).send('Invalid Password.')
         return
      }

      const token = await get_auth_code({ username: username })

      res.status(201).header('auth_code', token).send('User Verified.')
   } catch (e)
   {
      res.status(500).send('Error: User login failed.')
   }
}


// get '/users?limit=<param>&start[< "l,g" + "e, ">]=<param>'
// list users with query
// Q: need some explanation on the query?
// the below code will just return ALL users.
getUsers = async (req, res) =>
{
   try
   {
      const users = (await client.query('SELECT username FROM users ORDER BY id ASC'))
      if (!users) throw "Error: Users could not be retrieved!"

      res.status(200).json(users)
   } catch (e)
   {
      res.status(500).send('Error: Unable to retrieve user list.')
   }
}

// get '/users/:id'
// get user given user id
// Q: what should be returned? just username?
getID = async (req, res) =>
{
   try 
   {
      const id = parseInt(req.params.id)
      const query = {
         text: 'SELECT username FROM users WHERE id = $1',
         values: [id]
      }

      const user = (await client.query(query))[0]
      if (!user) throw "Error: Unable to retrieve user."

      res.status(200).json(user)
   } catch (e)
   {
      res.status(500).send('Error: Unable to retrieve user.')
   }

}

// delete '/users/:id'
// delete user given user id
deleteID = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const query = {
         text: 'DELETE FROM users WHERE id = $1',
         values: [id]
      }

      const result = client.query(query)
      if (!result) throw 'Error: Unable to delete user.' //need to check result

      res.status(200).send(`user ${id} deleted.`)
   } catch (e)
   {
      res.status(500).send('Error: Unable to delete user.')
   }
}

// put '/users/:id'
// update user given user id
// Q: just updating password? Option to update username or both?
putID = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const { username, password } = req.body

      const salt = crypto.randomBytes(32).toString('hex')
      if (password == null || password.length < 1 || username == null || username.length < 1)
      {
         res.status(400).send('username or password not provided.')
         return
      }
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

      const queries = [
         {
            text: "UPDATE users SET username=$2, password=$3, salt=$4 WHERE id = $1",
            values: [id, username, hash, salt]
         },
         {
            text: "UPDATE users SET username=$2 WHERE id = $1",
            values: [id, username]
         },
         {
            text: "UPDATE users SET password=$2, salt=$3 WHERE id = $1",
            values: [id, hash, salt]
         }
      ]

      let results = null //check results
      if (username && password)
      {
         results = await client.query(queries[0])
      } else if (username)
      {
         results = await client.query(queries[1])
      } else if (password)
      {
         results = await client.query(queries[2])
      } else
      {
         res.status(402).send('Include username or password in body to update')
         return
      }

      res.status(200).send(`user ${id} updated.`)
   } catch (e)
   {
      res.status(500).send('Error: Unable to update user.')
   }

}

// post '/users/:id/devices'
// input a new device tied to user id
postDevices = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const { mac_address, latitude, longitude } = req.body;
      // should get mac_address / identifier from somewhere else???
      const query = {
         text: "INSERT INTO groundstations (user_id, mac_address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *",
         values: [id, mac_address, latitude, longitude]
      }

      const results = await client.query(query)

      res.status(201).send(`Device ${mac_address} added with id ${results[0].id} and associated with user ${id}`)
   } catch (e)
   {
      res.status(500).send(`Error: ${e}`)
   }
}

// get '/users/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>'
// get devices from a user given query
// Q: so this query will only be for a specific user?
getDevices = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const query = {
         text: 'SELECT mac_address, latitude, longitude FROM groundstations WHERE user_id = $1',
         values: [id]
      }
      const results = await client.query(query)

      res.status(200).send(results)
   } catch (e)
   {
      res.status(500).send(`Error: ${e}`)
   }
}

// get '/users/:id/devices/:deviceid'
// get device information given a device ID and user ID
getUserDevices = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const deviceid = parseInt(req.params.deviceid)
      const query = {
         text: 'SELECT mac_address, latitude, longitude FROM groundstations WHERE user_id = $1 AND id = $2',
         values: [id, deviceid]
      }
      const results = await client.query(query)

      res.status(200).send(results)
   } catch (e)
   {
      res.status(500).send(`Error: ${e}`)
   }
}

// delete '/users/:id/devices/:deviceid'
// delete a device tied to a specific user
deleteUserDevices = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const deviceid = parseInt(req.params.deviceid)
      const query = {
         text: 'DELETE FROM groundstations WHERE user_id = $1 AND id = $2',
         values: [id, deviceid]
      }
      const results = await client.query(query)

      res.status(200).send(`device ${deviceid} deleted.`)
   } catch (e)
   {
      res.status(500).send(`Error: Unable to delete device ${deviceid}.`)
   }
}

// put '/users/:id/devices/:deviceid'
// update a device tied to a specific user
putUserDevices = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const deviceid = parseInt(req.params.deviceid)
      const { latitude, longitude } = req.body
      const queries = [
         {
            text: 'UPDATE groundstations SET latitude = $3, longitude = $4 WHERE user_id = $1 AND id = $2',
            values: [id, deviceid, latitude, longitude]
         }, {
            text: 'UPDATE groundstations SET latitude = $3 WHERE user_id = $1 AND id = $2',
            values: [id, deviceid, latitude]
         }, {
            text: 'UPDATE groundstations SET longitude = $3 WHERE user_id = $1 AND id = $2',
            values: [id, deviceid, longitude]
         }
      ]

      let results = null
      if (latitude && longitude)
      {
         results = await client.query(queries[0])
      } else if (latitude)
      {
         results = await client.query(queries[1])
      } else if (longitude)
      {
         results = await client.query(queries[2])
      } else
      {
         res.status(402).send('Include latitude or longitude in body to update')
         return
      }

      res.status(200).send(`device ${deviceid} updated.`)
   } catch (e)
   {
      res.status(500).send('Error: Unable to update device.')
   }
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
   // verify that device is assigned to user
   // any o-auth related stuff here?
   // prompt broker to set-up message queue from time a to b for this device
   // redirect to give client information for websocket connection
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