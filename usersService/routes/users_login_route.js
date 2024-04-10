const express = require('express')
const router = express.Router()

const {
   postUsers,
   isValidUser,
} = require('../controllers/users_controller')



/* register a new user */
router.post('/', postUsers)

/* login a user */
router.post('/validate', isValidUser)




module.exports = router