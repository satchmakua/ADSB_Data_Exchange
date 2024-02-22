//const Pool = require('pg').Pool
const crypto = require('crypto')

// const pool = new Pool({
//    user: "janna",
//    host: "localhost",
//    database: "postgres",
//    password: "password",
//    port: 5432
// })

const client = require('../database/db.js')

standardReturn = (res, error, results, errCode, customErrStr) =>
{
   if (error)
   {
      const code = errCode ?? 500
      if (customErrStr)
      {
         res.status(code).send(customErrStr)
      } else
      {
         res.status(code).send(`Error: ${error}`)
      }
      return
   }
   res.status(200).send(results.rows)
}

// post '/users'
// create user
postUsers = (req, res) =>
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
      text: "INSERT INTO users (username, password, salt) VALUES ('$1', '$2', '$3') RETURNING *",
      values: [username, hash, salt]
  };

   client.query(query, (error, results) =>
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
isValidUser = (req, res) =>
{
   const { username, password } = req.body;
   let salt = ''

   if (password == null || password.length < 1 || username == null || username.length < 1)
   {
      res.status(400).send('username or password not provided.')
      return
   }

   const saltQuery = {
      text: "SELECT salt from users WHERE username='$1'",
      values: [username]
   }

   client.query(saltQuery, (error, results) =>
   {
      if (error)
      {
         res.status(500).send('User not found in the system.')
         return
      }
      salt = results.rows[0].salt
   })

   const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

   const query = {
      text: "SELECT id FROM users WHERE username='$1' AND password='$2'",
      values: [username, hash]
   }

   client.query(query, (error, results) =>
   {
      if (error)
      {
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
   client.query('SELECT * FROM users ORDER BY id ASC', (error, results) =>
   {
      if (error)
      {
         res.status(500).send('Unable to retrieve user list.')
         console.log("hit users")
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
   const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
   }
   client.query(query, (error, results) => standardReturn(res, error, results))
}

// delete '/users/:id'
// delete user given user id
deleteID = (req, res) =>
{
   const id = parseInt(req.params.id)
   const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [id]
   }
   client.query(query, (error, results) => standardReturn(res, error, results))
}

// put '/users/:id'
// update user given user id
// Q: just updating password? Option to update username or both?
putID = (req, res) =>
{
   const id = parseInt(req.params.id)
   const { username, password } = req.body

   const salt = crypto.randomBytes(32).toString('hex')
   if (password == null || password.length < 1 || username == null || username.length < 1 ) {
       res.status(400).send('username or password not provided.')
       return
   }
   const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

   const queries = [
      {
         text: "UPDATE users SET username='$2', password='$3', salt='$4' WHERE id = $1",
         values: [id, username, hash, salt]
      },
      {
         text: "UPDATE users SET username='$2' WHERE id = $1",
         values: [id, username]
      },
      {
         text: "UPDATE users SET password='$2', salt='$3' WHERE id = $1",
         values: [id, hash, salt]
      }
   ]

   if (username && password) {
      client.query(queries[0], (error, results) => standardReturn(res, error, results))
   } else if (username) {
      client.query(queries[1], (error, results) => standardReturn(res, error, results))
   } else if (password) {
      client.query(queries[2], (error, results) => standardReturn(res, error, results))
   } else {
      res.status(402).send('Include username or password in body to update')
   }

}

// post '/users/:id/devices'
// input a new device tied to user id
postDevices = (req, res) =>
{
   const id = parseInt(req.params.id)
   const { mac_address, latitude, longitude } = req.body;
   // should get mac_address / identifier from somewhere else???
   const query = {
      text: "INSERT INTO groundstations (user_id, mac_address, latitude, longitude) VALUES ($1, '$2', $3, $4) RETURNING *",
      values: [id, mac_address, latitude, longitude]
   }
   client.query(query, (error, results) =>
   {
      if (error)
      {
         res.status(500).send(`Error: ${error}`)
         return
      }
      res.status(201).send(`Device ${mac_address} added with id ${results.rows[0].id} and associated with user ${id}`)
   })
}

// get '/users/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>'
// get devices from a user given query
// Q: so this query will only be for a specific user?
getDevices = (req, res) =>
{
   const id = parseInt(req.params.id)
   const query = {
      text: 'SELECT * FROM groundstations WHERE user_id = $1',
      values: [id]
   }
   client.query(query, (error, results) =>
   {
      if (error)
      {
         res.status(500).send(`Error: ${error}`)
         return
      }
      res.status(200).send(results.rows)
   })
}

// get '/users/:id/devices/:deviceid'
// get device information given a device ID and user ID
getUserDevices = (req, res) =>
{
   const id = parseInt(req.params.id)
   const deviceid = parseInt(req.params.deviceid)
   const query = {
      text: 'SELECT * FROM groundstations WHERE user_id = $1 AND id = $2',
      values: [id, deviceid]
   }
   client.query(query, (error, results) =>
   {
      if (error)
      {
         res.status(500).send(`Error: ${error}`)
         return
      }
      res.status(200).send(results.rows)
   })
}

// delete '/users/:id/devices/:deviceid'
// delete a device tied to a specific user
deleteUserDevices = (req, res) =>
{
   const id = parseInt(req.params.id)
   const deviceid = parseInt(req.params.deviceid)
   const query = {
      text: 'DELETE FROM groundstations WHERE user_id = $1 AND id = $2',
      values: [id, deviceid]
   }
   client.query(query, (error, results) => standardReturn(res, error, results))
}

// put '/users/:id/devices/:deviceid'
// update a device tied to a specific user
putUserDevices = (req, res) =>
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
   if (latitude && longitude)
   {
      client.query(queries[0], (error, results) => standardReturn(res, error, results))
   } else if (latitude)
   {
      client.query(queries[1], (error, results) => standardReturn(res, error, results))
   } else if (longitude)
   {
      client.query(queries[2], (error, results) => standardReturn(res, error, results))
   } else
   {
      res.status(402).send('Include latitude or longitude in body to update')
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