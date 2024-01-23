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

router.post('/', postUsers)

router.post('/validate', isValidUser)

// router.get('?limit=<param>&start[< "l,g" + "e, ">]=<param>',
// getUsers)
// once query is implemented uncomment line 24 and delete below line
router.get('', getUsers)

router.get('/:id', getID)

router.delete('/usr/:id', deleteID)

router.put('/users/:id', putID)

router.get('/users/:id/client/connect', getConnect)

router.put('/users/:id/client/disconnect', putDisconnect)

router.post('/users/:id/devices', postDevices)

//router.get('/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>', getDevices)
router.get('/users/:id/devices', getDevices)

router.get('/users/:id/devices/:deviceid', getUserDevices)

router.delete('/users/:id/devices/:deviceid', deleteUserDevices)

router.put('/users/:id/devices/:deviceid', putUserDevices)

//router.get('/:id/devices/:id/connect', getConnectUserDevices)

//router.put('/:id/devices/:id/disconnect', putDisconnectUserDevices)

router.get('/users/:id/devices/:id/adsb?start=<param>&end=<param> ', getAdsbUserDevices)

module.exports = router