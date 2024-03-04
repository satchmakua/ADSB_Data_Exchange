
const pgp = require('pg-promise')()
const readline = require('readline')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

require('dotenv').config({
    override: true,
    path: path.join(__dirname, '../dev.env')
})

// Configurable database connection settings
const dbConfig = {
    host: process.env.ADSDB_HOST,
    port: parseInt(process.env.ADSDB_PORT, 10),
    database: process.env.ADSDB_DB,
    user: process.env.ADSDB_USER,
    password: process.env.ADSDB_PASSWORD
}

const db = pgp(dbConfig)

// Interactive CLI for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Function to retrieve and display the latest ADS-B messages from the database
async function fetchLatestAdsbMessages() {
    try {
        const messages = await db.any('SELECT * FROM adsb_messages ORDER BY timestamp DESC LIMIT 10', [])
        console.log('Latest ADS-B Messages:', messages)
    } catch (error) {
        console.error('Error fetching ADS-B messages:', error)
    }
}

// Function to retrieve and display ADS-B messages within a specific time range
async function fetchAdsbMessagesByTime(start, end) {
    try {
        const messages = await db.any('SELECT * FROM adsb_messages WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp DESC', [start, end])
        console.log(`ADS-B Messages from ${start} to ${end}:`, messages)
    } catch (error) {
        console.error('Error fetching ADS-B messages:', error)
    }
}

// Adjusted function to prompt user for time range and fetch messages
function queryMessagesByTime() {
    rl.question('Enter start time (YYYY-MM-DD HH:MM:SS) or press ENTER to fetch latest messages: ', (start) => {
        if (start === '') {
            fetchLatestAdsbMessages().finally(() => rl.close())
        } else {
            rl.question('Enter end time (YYYY-MM-DD HH:MM:SS): ', (end) => {
                fetchAdsbMessagesByTime(start, end).finally(() => rl.close())
            })
        }
    })
}

async function interactWithBroker() {
    rl.question('Enter action (fetchLatest/fetchByTime/proxyUser): ', async (action) => {
        switch (action) {
            case 'fetchLatest':
                await fetchLatestAdsbMessages()
                break
            case 'fetchByTime':
                break
            case 'proxyUser':
                rl.question('Enter user service path: ', async (path) => {
                    const response = await proxyToUserService(path)
                    console.log('User Service Response:', response)
                })
                break
            default:
                console.log('Invalid action.')
        }
        rl.close()
    })
}

async function proxyToUserService(path) {
    const url = `http://localhost:3001${path}`
    const response = await fetch(url)
    return response.json()
}

// Main interaction entry point
interactWithBroker()

db.one('SELECT NOW()').then(result => {
    console.log('Database connection test:', result)
}).catch(error => {
    console.error('Database connection test error:', error)
})

process.on('exit', () => {
    console.log('Database connection closed.')
})
