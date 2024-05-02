const express = require('express')
const router = express.Router()

const {
   getUsers,
   getID,
   deleteID,
   putID,
   getConnect,
   putDisconnect,
   postDevices,
   getDevices,
   getUserDevices,
   deleteUserDevices,
   putUserDevices
} = require('../controllers/users_controller')

// TODO: implement some sort of admin policy with oAuth so we can use the below route (only want admin to access full-list).
// TODO: implement query parameters for this route (eventually use line 25 for route instead of line 24).
// logic handled in line 126 of users_controllers.js
//router.get('', getUsers)
//router.get('?limit=<param>&start[< "l,g" + "e, ">]=<param>', getUsers)

router.get('/:id', getID)

router.delete('/:id', deleteID)

router.put('/:id', putID)

router.get('/:id/client/connect', getConnect)

router.put('/:id/client/disconnect', putDisconnect)

router.post('/:id/devices', postDevices)

// TODO: implement query parameters for this route (eventually use line 40 instead of line 41).
// logic handled in line 269 of users_controllers.js
//router.get('/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>', getDevices)
router.get('/:id/devices', getDevices)

router.get('/:id/devices/:deviceid', getUserDevices)

router.delete('/:id/devices/:deviceid', deleteUserDevices)

router.put('/:id/devices/:deviceid', putUserDevices)

module.exports = router