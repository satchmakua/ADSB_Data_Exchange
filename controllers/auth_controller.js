postLogin = (req, res) =>
{
    res.status(200).json({"yup": "yup"});
}

postLogout = (req, res) =>
{
    res.status(200).json({});
}

postRefresh = (req, res) =>
{
    res.status(200).json({});
}

module.exports = {
    postLogin,
    postLogout,
    postRefresh,
}