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
       const response = await axios.post('http://35.87.79.158:80/users/validate', {
           username: 'admin1',
           password: 'password'
       });
       return response.headers.auth_code;
   } catch (error) {
       console.error('Error fetching access code:', error.message);
       throw error;
   }
}

// user calls tokens/login when logging in, when they receive a response that refresh is needed then
// user needs to call tokens/refresh
async function getAuthorizationToken(authCode) {
   try {
       const response = await axios.post('http://35.87.79.158:80/users/tokens/login', {
         header:
         {
           "auth_code": authCode
         },
         body:
         {
           "scope":"admin"
         }
       });
       return (response.headers.access_token, response.headers.refresh_token);
   } catch (error) {
       console.error('Error fetching authorization token:', error.message);
       throw error;
   }
}

async function main() {
   try {
      // below functions are to successfully login and get oAuth token.
      const auth_code = await getAccessCode()
      const tokens = await getAuthorizationToken(auth_code)
      const access_token = tokens[0]
      const refresh_token = tokens[1]

      const socket = new WebSocket(`http://35.87.79.158:80/${userId}`)

      socket.on('open', () => {
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

      setTimeout(async function streamData() { // wait for websocket connection to be set-up
         try {
            const response = await axios.post(`http://35.87.79.158:80/users/${userId}/devices/${deviceId}/stream`, {
               headers: {
                  auth_code: auth_code,
                  access_token: access_token,
                  refresh_token: refresh_token
               }
               })
            console.log(`Received data: ${JSON.stringify(response.data)}`)
      } catch (error) {
            console.log(`Error ${error.code}: ${error.message}`)
      }
      }, 2000);

} catch (error) {
   console.error('Error:', error);
}
}

main();

