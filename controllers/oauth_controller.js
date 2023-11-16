const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const path = require('path')
// require("dotenv").config({
//     override: true,
//     //path: path.join(__dirname, '../dev.env')
//     path: path.join(__dirname, 'dev.env')
//  })

// try 
// {
//         console.log('inside try')
//         await client.query('BEGIN')
//         //const q = "select * from users"
//         const q = "UPDATE users SET token = '456a' where username = 'satchet'"
//         const output = await client.query(q)
//         await client.query('COMMIT')
//         console.log(output)
//         console.log(await client.query("select * from users"))
// } 

// catch (e)
// {
//     console.log(e)
//     client.release()
// }

// Function for handling OAuth login
const postLogin = (req, res) =>
{
    console.log("OAuth login route hit") 
    res.status(200).json({ "oauth": "login" }) 
}

// Function for handling OAuth logout
const postLogout = (req, res) =>
{
    res.status(200).json({ "oauth": "logged out" }) 
}

// Function for refreshing OAuth tokens
const postRefresh = (req, res) =>
{
    res.status(200).json({ "oauth": "token refreshed" })
}

// Function for handling OAuth callback
const postCallback = (req, res) =>
{
    res.status(200).json({ "oauth": "callback" }) 
}

const generateAuthTokens = async (user, client, db) =>
{
   // console.log(client)
    // need to search in db for user and get hex value of id
    await client.query('BEGIN')
//         const q = "UPDATE users SET token = '456a' where username = 'satchet'"
//         const output = await client.query(q)
//         await client.query('COMMIT')

    const id = await client.query(`SELECT id from ${db} where username = '${user}';`) //"\x01"
    console.log(id);
    // const access = 'auth'
    // const token = jwt.sign(
    // {
    //     _id: id, 
    //     access
    // }, 
    // process.env.JWT_SECRET).toString()



}




module.exports = {
    // postLogin,
    // postRefresh,
    // postLogout,
    // postCallback,
    generateAuthTokens
}
