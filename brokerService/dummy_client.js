const pgp = require('pg-promise')()
const db = pgp('postgresql://postgres:sagetech123@localhost:5432/database')

// Function to retrieve and display the latest ADS-B messages from the database
async function fetchLatestAdsbMessages() {
    try {
        const messages = await db.any('SELECT * FROM adsb_messages ORDER BY timestamp DESC LIMIT 10', [])
        console.log('Latest ADS-B Messages:', messages)
    } catch (error) {
        console.error('Error fetching ADS-B messages:', error)
    }
}

// Test query to check database connection
db.one('SELECT NOW()')
    .then(result => {
        console.log('Database connection test:', result)
        fetchLatestAdsbMessages()
    })
    .catch(error => {
        console.error('Database connection test error:', error)
    })
