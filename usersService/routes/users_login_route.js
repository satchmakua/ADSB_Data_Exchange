const express = require('express')
const router = express.Router()

const {
   postUsers,
   isValidUser,
} = require('../controllers/users_controller')

// these routes do not require oAuth tokens.
// useCase: line 58-60 in users.js

/* register a new user */
router.post('/', postUsers)

/* login a user */
router.post('/validate', isValidUser)

module.exports = router