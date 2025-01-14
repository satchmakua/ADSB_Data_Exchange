// Broker Component - ADS-B Restful Data Exchange

// Import required libraries and modules
const { exec, ChildProcess, execFile, spawn } = require('node:child_process')
const express = require('express')
const proxy = require('express-http-proxy')
const http = require('http')
const bodyParser = require('body-parser') // Middleware for parsing HTTP request bodies
const pgp = require('pg-promise')() // PostgreSQL database library
const cors = require('cors') // Cross-Origin Resource Sharing middleware
const { Readable, Writable } = require('stream') // Needed for message queues
const WebSocket = require('ws') // WebSocket setup for ADS-B
var kill = require('tree-kill')

// need to put locks on these!!
const groundStationSockets = new Map()
const userSockets = new Map()
const activeUserRequests = new Map()

const path = require('path')
const { stdout } = require('node:process')
require('dotenv').config({
    override: true,
    path: path.join(__dirname, '../dev.env')
})

// Function to help troubleshoot db connection issues
function logDbConnectionDetails(db)
{
    db.connect()
        .then(obj =>
        {
            console.log('Connected to the database:', db.$config.options)
            obj.done() // release the connection
        })
        .catch(error =>
        {
            console.error('Error connecting to the database:', error)
        })
}

// Define user service and oauth service urls for proxy service
let user = 'http://localhost:3001'
let auth = 'http://localhost:3002'

// Define the server's port number and database connection URI
const PORT = process.env.PORT || 3000
const DB_URI = process.env.DB_URI || `postgresql://${process.env.ADSDB_USER}:${process.env.ADSDB_PASSWORD}\
@${process.env.ADSDB_HOST}:${process.env.ADSDB_PORT}/${process.env.ADSDB_DB}`

const db = pgp(DB_URI)
logDbConnectionDetails(db)

// Create an Express application
const app = express()
const server = http.createServer(app)
const stationSocketServ = new WebSocket.Server({ server })
const usersSocketServ = new WebSocket.Server({ port: 3003 })

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Enable Cross-Origin Resource Sharing (CORS) and parse JSON data from request bodies
app.use(cors())
app.use(bodyParser.json())


const adminQueue = new Readable(
    {
        objectMode: true,
        read() { } // The broker shouldn't ever have to read from queue
    }
)

const adminQueueOut = new Writable(
    {
        objectMode: true,
        write() { }
    }
)

adminQueue.pipe(adminQueueOut)

// Handle groundstation websocket connections
stationSocketServ.on('connection', function connection(ws)
{
    let stationID = 0

    ws.on('close', () =>
    {
        console.log("Groundstation socket closed signal")
        groundStationSockets.delete(ws) // what is this deleting?
    })

    ws.on('message', function incoming(message) 
    {
        let data = JSON.parse(message)
        console.log('Received message:', data)

        if (data.type == "init")
        {
            console.log("Socket init signal received")
            stationID = data.stationID
            console.log('stationID ', stationID)
            groundStationSockets.set(stationID, ws)
            console.log("Station socket mapped: " + groundStationSockets.has(stationID))
        }
        else
        {
            // send message to client websocket
            //console.log('data.gsID ', data.groundStationID)
            // create route to get userID from stationID

            const activeRequests = activeUserRequests.get(data.groundStationID)
            if (activeRequests)
            {

                userSockets.forEach((ws, userId) =>
                {
                    // Do something with each WebSocket and its associated key (userId)
                    //console.log(`WebSocket for user ${userId}:`, ws);
                    if (activeRequests.includes(userId))
                    {
                        ws.send(JSON.stringify(data))
                        //console.log(`sent data to client ${userId}`)
                    }
                });
            }

            adminQueue.push(data)

            // db.none('INSERT INTO adsb_messages(message_data, timestamp) VALUES($1, NOW())', [data])
            //     .then(() =>
            //     {
            //         console.log('Message successfully inserted into database')
            //     })
            //     .catch(err =>
            //     {
            //         console.error('Error inserting message into database:', err)
            //     })
        }

    })
})

usersSocketServ.on('connection', function connection(userws)
{
    let startSim = 'node ../ads-b-simulator/app.js 1 10 false'

    console.log('connection!!!!!')

    let sim = spawn(startSim, { cwd: '../ads-b-simulator', shell: true, killSignal: 'SIGINT' })

    userws.on('message', function incoming(message) 
    {
        let data = JSON.parse(message)

        if (data.type == "init")
        {
            console.log("Client init signal received")
            userId = data.userId
            if (userId == undefined)
            {
                console.log('userId is undefined')
                this.close()
                return
            }
            console.log('userId ', userId)
            userSockets.set(userId, userws)
            console.log("Station socket mapped: " + userSockets.has(userId))
        }
    })

    userws.on('close', () =>
    {
        console.log("User socket closed signal")
        userSockets.delete(userId) // or should this be userSockets.delete(usersws) ??
        kill(sim.pid, 'SIGTERM')
    })

})

// Authentication should happen in users controller when the client is making a socket connection request
// that call will then make an internal call back to the broker to hand back a socket connection.
// // Middleware to authenticate WebSocket connections
// stationSocketServ.on('connection', (ws, req) => {
//     // Placeholder for authentication check, e.g., via token in query params
//     const token = req.url.split('token=')[1] // Simplified example
//     if (!token || token !== 'expectedToken') {
//         ws.terminate() // Close connection if not authenticated
//         console.log('WebSocket connection closed due to failed authentication')
//     }
// })



/* API calls to oauth service */
// const verify_users = require('./oauth/verify_route')
// app.use(verify_users)

app.post("/users/:id/devices/:deviceid/stream", (req, res) => 
{
    const userId = parseInt(req.params.id)
    const deviceId = parseInt(req.params.id)
    //console.log('groundStationSocket keys', groundStationSockets.keys())
    //console.log('userSockey keys', userSockets.keys())

    if (!groundStationSockets.has(deviceId))
    {
        res.status(500).send(`Broker does not have an active connection with groundStation with ID ${deviceId}`)
        console.log('groundStation Socket Not Found')
        return
    }
    if (!userSockets.has(userId))
    {
        res.status(400).send('Websocket has not been created yet. Please make websocket request')
        console.log('client websocket not found')
        return
    }
    //console.log('activeUserRequests ', activeUserRequests.keys())
    // add userId to deviceId stream to Queue
    if (!activeUserRequests.get(deviceId))
    {
        //console.log('no active requests')
        activeUserRequests.set(deviceId, [userId])
    } else
    {
        //console.log('adding value to active requerstss')
        let activeRequests = activeUserRequests.get(deviceId)
        activeRequests.add(userId)
        activeUserRequests.set(deviceId, activeRequests)
    }
})

// Forward API call to the appropriate service
// It is each services responsibility to ensure that oAuth middleware is applied if required for any URI's.
app.all("/users/*", proxy(user))
app.all("/auth/*", proxy(auth))

// GET route to fetch messages from the database
app.get('/message', async (req, res) =>
{
    try
    {
        const messages = await db.any('SELECT * FROM adsb_messages')
        res.status(200).json(messages)
    } catch (err)
    {
        res.status(500).send("Error fetching messages: " + err)
    }

})

// Actual implementation for subscription management
const subscriptions = {} // Simplified example to keep track of subscriptions

app.post('/subscribe', (req, res) =>
{
    const { subscriberId, topic } = req.body
    if (!subscriptions[subscriberId])
    {
        subscriptions[subscriberId] = new Set()
    }
    subscriptions[subscriberId].add(topic)
    console.log(`Subscriber ${subscriberId} added to topic ${topic}`)
    res.status(200).json({ message: `Subscribed to topic ${topic}` })
})

app.post('/unsubscribe', (req, res) =>
{
    const { subscriberId, topic } = req.body
    if (subscriptions[subscriberId] && subscriptions[subscriberId].has(topic))
    {
        subscriptions[subscriberId].delete(topic)
        console.log(`Subscriber ${subscriberId} removed from topic ${topic}`)
        res.status(200).json({ message: `Unsubscribed from topic ${topic}` })
    } else
    {
        res.status(404).json({ message: `Subscription not found for topic ${topic}` })
    }
})

// Error handling middleware for server errors
app.use((err, req, res, next) =>
{
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
})

// Middleware for logging request details
app.use((req, res, next) =>
{
    console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`)
    next()
})

// 404 catch-all handler for handling undefined routes
app.use((req, res, next) =>
{
    console.log('undefined route in broker service')
    res.status(404).send("Could not find resource!")
})

// Start the server and listen on the specified port
server.listen(PORT, () =>
{
    console.log(`Broker service running on port ${PORT}`)
})

db.connect()
    .then(obj =>
    {
        console.log('Connected to the database')
        obj.done() // success, release the connection
    })
    .catch(error =>
    {
        console.log('ERROR:', error.message || error)
    })

console.log(`Database URI: ${DB_URI}`)

// Gracefully shut down on SIGINT (Ctrl-C)
process.on('SIGINT', function ()
{
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
    pgp.end()  // Close the database connection
    process.exit(0)
})

// Clean shutdown logic for WebSocket server
const shutdown = () =>
{
    console.log('Shutting down server...')
    server.close(() =>
    {
        console.log('HTTP server closed.')
        stationSocketServ.close(() =>
        {
            console.log('WebSocket server closed.')
            pgp.end().then(() =>
            {
                console.log('Database connections closed.')
                process.exit(0)
            })
        })
    })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)


// OLD WEBSOCKET CODE
// Tested without and determined that this code is not accessed or needed to run websockets

// app.get('/groundstation/websocket', (req, res) =>
// {
//     const ws = new WebSocket('ws://localhost:3000')
// })

// app.get('/users/websocket/:userId', (req, res) =>
// {
//     const userId = parseInt(req.params.userId)
//     const userws = new WebSocket(`ws://localhost:3003/${userId}`)
//     console.log('here')
// })

// TO DO: How and when is this used??
// Handle WebSocket upgrade requests
// app.on('upgrade', (request, socket, head) =>
// {
//     if (request.headers['upgrade'] !== 'websocket')
//     {
//         console.log('Not a websocket upgrade request')
//         return
//     }
//     console.log("Socket upgraded!!!!!!")
//     stationSocketServ.handleUpgrade(request, socket, head, (ws) =>
//     {
//         groundStationSockets.set(request.groundStationID, socket)
//         stationSocketServ.emit('connection', ws, request)
//     })
//     usersSocketServ.handleUpgrade(request, socket, head, (ws) =>
//     {
//         const userId = parseInt(request.params.userId)
//         userSockets.set(userId, ws)
//         usersSocketServ.emit('connection', ws, request)
//     })  
// })

