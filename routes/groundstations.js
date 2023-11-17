
const express = require('express')
const router = express.Router()

const {
    getConnectGroundstations,
    putDisconnectGroundstations,
    deleteGroundstations,
    putGroundstations,
    getGroundstations
} = require('../controllers/oauth_controller')

router.get('/connect', getConnectGroundstations)
router.put('/disconnect', putDisconnectGroundstations)
router.delete('/', deleteGroundstations)
router.put('/', putGroundstations)
router.get('/', getGroundstations)





module.exports = router
