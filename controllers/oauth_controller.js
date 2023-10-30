const oauthLogin = (req, res) => {
    console.log("OAuth login route hit"); // debugging
    res.status(200).json({"oauth": "login"});
}

const oauthLogout = (req, res) => {
    res.status(200).json({"oauth": "logged out"});
}

const oauthRefresh = (req, res) => {
    res.status(200).json({"oauth": "token refreshed"});
}

const oauthCallback = (req, res) => {
    res.status(200).json({"oauth": "callback"});
}

module.exports = {
    oauthLogin,
    oauthCallback,
    oauthLogout, 
    oauthRefresh 
};