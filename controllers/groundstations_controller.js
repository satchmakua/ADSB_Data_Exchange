
/* get /groundstations/connect  */
/* Connect ground station via websocket, layered with OAuth */
getConnectGroundstations = (req, res) =>
{
    res.status(200).json({ "groundstations": "callback" })
}

/* put /groundstations/disconnect  */
/* Allow ground station to close socket. */
putDisconnectGroundstations = (req, res) =>
{
    res.status(200).json({ "groundstations": "callback" })
}

/* delete /grounstations  */
/* Delete ground station info */
deleteGroundstations = (req, res) =>
{
    res.status(200).json({ "groundstations": "callback" })
}

/* put  /grounstations */
/* Update groundstation info */
putGroundstations = (req, res) =>
{
    res.status(200).json({ "groundstations": "callback" })
}

/* get /grounstations */
/* Get groundstation info */
getGroundstations = (req, res) =>
{
    res.status(200).json({ "groundstations": "callback" })
}




module.exports = {
    getConnectGroundstations,
    putDisconnectGroundstations,
    deleteGroundstations,
    putGroundstations,
    getGroundstations
}
