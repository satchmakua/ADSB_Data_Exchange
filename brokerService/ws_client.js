/* This module serves as a WebSocket client that interacts with a WebSocket server,
primarily used for real-time communication in the ADS-B system. It manages WebSocket
connections for specific user and device IDs. The focus is on maintaining a persistent
connection with a server, sending initialization data, and then continuously receiving
and logging data from the server. */

const WebSocket = require('ws')
const axios = require('axios')

const userId = parseInt(process.argv[3])
const deviceId = parseInt(process.argv[4])
if (process.argv[2] != 'websocket' || !userId || !deviceId)
{
   console.error('Usage: node ws_client.js websocket <userId> <deviceId>')
   process.exit(1)
}

async function getAccessCode() {
   try {
       const response = (await axios.post('http://localhost:3000/users/validate', {
           username: 'admin1',
           password: 'password'
       })).headers;
       return response.auth_code;
   } catch (error) {
       console.error('Error fetching access code:', error.message);
       throw error;
   }
}

// Initiate user authentication by calling tokens/login.
// If a token refresh is necessary, the user must subsequently call tokens/refresh.
async function getAuthorizationToken(authCode) {
   try {
       // Post to tokens/login in admin scope & auth code to obtain access/refresh tokens.
       const response = (await axios.post('http://127.0.0.1:3000/users/tokens/login', 
       {
         "scope": "admin"
       },{
          headers:
         {
           "auth_code": authCode
         }
      })).headers;

       return {
         access_token:response.access_token, 
         refresh_token:response.refresh_token
      };
   } catch (error) {
       console.error('Error fetching authorization token:', error.message);
       throw error;
   }
}

// Establish a WebSocket connection and handle connection events.
const socket = new WebSocket(`ws://localhost:3003/${userId}`)
socket.on('open', () => {
   // Send initialization data to the server upon connection.
   socket.send(JSON.stringify(
      {
         type: 'init',
         userId: userId
      }))

   console.log('WebSocket connection opened.')
})
socket.on('message', (data) => {
   console.log('Received message from server:', JSON.parse(data))
})
      
socket.on('close', () => {
   console.log('WebSocket connection closed.')
})
      
socket.on('error', (error) => {
   console.error('WebSocket error:', error.message)
})

async function main() {
   try {
      // Obtain the initial authorization code.
      const auth_code = await getAccessCode()
      console.log("code:",auth_code)
      const {access_token, refresh_token} = await getAuthorizationToken(auth_code)
     
      console.log("access:",access_token)
      console.log("refresh:",refresh_token)
     

      setTimeout(async function streamData() { // wait for websocket connection to be set-up
         try {
            const response = await axios.post(`http://localhost:3000/users/${userId}/devices/${deviceId}/stream`, {}, {
               headers: {
                  "access_token": access_token,
                  "refresh_token":  refresh_token
               }
               })
            console.log(`Received data: ${JSON.stringify(response.data)}`)
      } catch (error) {
         console.log(error)
            console.log(`Error ${error.code}: ${error.message}`)
      }
      }, 2000);

} catch (error) {
   console.error('Error:', error);
   throw error;
}
}

main();

