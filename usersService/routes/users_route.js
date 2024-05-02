const express = require('express')
const router = express.Router()

const {
   getUsers,
   getID,
   deleteID,
   putID,
   //getConnect,
   //putDisconnect,
   postDevices,
   getDevices,
   getUserDevices,
   deleteUserDevices,
   putUserDevices,
   //getConnectUserDevices,
   //putDisconnectUserDevices,
   //getAdsbUserDevices,
} = require('../controllers/users_controller')

// TODO: implement some sort of admin policy with oAuth so we can use the below route (only want admin to access full-list).
// TODO: implement query parameters for this route (eventually use line 25 for route instead of line 24).
// logic handled in line 126 of users_controllers.js
//router.get('', getUsers)
//router.get('?limit=<param>&start[< "l,g" + "e, ">]=<param>', getUsers)

router.get('/:id', getID)

router.delete('/:id', deleteID)

router.put('/:id', putID)

router.post('/:id/devices', postDevices)

// TODO: implement query parameters for this route (eventually use line 40 instead of line 41).
// logic handled in line 269 of users_controllers.js
//router.get('/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>', getDevices)
router.get('/:id/devices', getDevices)

router.get('/:id/devices/:deviceid', getUserDevices)

router.delete('/:id/devices/:deviceid', deleteUserDevices)

router.put('/:id/devices/:deviceid', putUserDevices)

// the routes methods were originally going to be handled by users service
// but they are now handled by the broker. Not deleting for sanity check, may need to rework.
//router.get('/:id/devices/:id/connect', getConnectUserDevices)

//router.put('/:id/devices/:id/disconnect', putDisconnectUserDevices)

//router.get('/:id/devices/:id/adsb?start=<param>&end=<param> ', getAdsbUserDevices)

//router.get('/:id/client/connect', getConnect)

//router.put('/:id/client/disconnect', putDisconnect)

module.exports = router