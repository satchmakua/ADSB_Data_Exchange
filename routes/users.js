const express = require('express')
const router = express.Router()

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
    getConnectUserDevices,
    putDisconnectUserDevices,
    getAdsbUserDevices,
    putUserAdsbStream,
} = require('../controllers/users_controller')

router.post('', postUsers)

router.post('/validate', isValidUser)

/* users */

// router.get('?limit=<param>&start[< "l,g" + "e, ">]=<param>',
// getUsers)
// once query is implemented uncomment line 24 and delete below line
router.get('', getUsers)

router.get('/:id', getID)

router.delete('/:id', deleteID)

router.put('/:id', putID)

router.get('/:id/client/connect', getConnect)

router.put('/:id/client/disconnect', putDisconnect)

/* devices */

router.post('/:id/devices', postDevices)

router.get('/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>', getDevices)

router.get('/:id/devices/:id', getUserDevices)

router.delete('/:id/devices/:id', deleteUserDevices)

router.put('/:id/devices/:id', putUserDevices)

// router.get('/:id/devices/:id/connect', getConnectUserDevices) /* REMOVE? */

// router.put('/:id/devices/:id/disconnect', putDisconnectUserDevices) /* REMOVE? */

router.get('/:id/devices/:id/adsb?start=<param>&end=<param> ', getAdsbUserDevices) 

router.put('/:id/devices/:id/adsb/stream ', putUserAdsbStream)

module.exports = router