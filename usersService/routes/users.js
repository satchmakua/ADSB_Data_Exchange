const express = require('express')
const router = express.Router()

const { verify_tokens } = require('../oauth/verify_tokens_middleware')




const {
   postUsers,
   isValidUser,
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
   putUserDevices,
   //getConnectUserDevices,
   //putDisconnectUserDevices,
   getAdsbUserDevices,
} = require('../controllers/users_controller')

router.post('/', postUsers)

router.post('/validate', isValidUser)

// router.get('?limit=<param>&start[< "l,g" + "e, ">]=<param>',
// getUsers)
// once query is implemented uncomment line 24 and delete below line
router.get('', verify_tokens, getUsers)

router.get('/:id', getID)

router.delete('/:id', deleteID)

router.put('/:id', putID)

router.get('/:id/client/connect', getConnect)

router.put('/:id/client/disconnect', putDisconnect)

router.post('/:id/devices', postDevices)

//router.get('/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>', getDevices)
router.get('/:id/devices', getDevices)

router.get('/:id/devices/:deviceid', getUserDevices)

router.delete('/:id/devices/:deviceid', deleteUserDevices)

router.put('/:id/devices/:deviceid', putUserDevices)

//router.get('/:id/devices/:id/connect', getConnectUserDevices)

//router.put('/:id/devices/:id/disconnect', putDisconnectUserDevices)

router.get('/:id/devices/:id/adsb?start=<param>&end=<param> ', getAdsbUserDevices)

module.exports = router