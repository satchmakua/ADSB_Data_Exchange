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
    //getConnectUserDevices,
    //putDisconnectUserDevices,
    getAdsbUserDevices,
} = require('../controllers/users_controller')

router.post('/usr/', postUsers)

router.post('/usr/validate', isValidUser)

// router.get('?limit=<param>&start[< "l,g" + "e, ">]=<param>',
// getUsers)
// once query is implemented uncomment line 24 and delete below line
router.get('/usr/', getUsers)

router.get('/usr/:id', getID)

router.delete('/usr/:id', deleteID)

router.put('/usr/:id', putID)

router.get('/usr/:id/client/connect', getConnect)

router.put('/usr/:id/client/disconnect', putDisconnect)

router.post('/usr/:id/devices', postDevices)

//router.get('/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>', getDevices)
router.get('/usr/:id/devices', getDevices)

router.get('/usr/:id/devices/:deviceid', getUserDevices)

router.delete('/usr/:id/devices/:deviceid', deleteUserDevices)

router.put('/usr/:id/devices/:deviceid', putUserDevices)

//router.get('/:id/devices/:id/connect', getConnectUserDevices)

//router.put('/:id/devices/:id/disconnect', putDisconnectUserDevices)

router.get('/usr/:id/devices/:id/adsb?start=<param>&end=<param> ', getAdsbUserDevices)

module.exports = router