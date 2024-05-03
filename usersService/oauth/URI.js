/*
   This file provides an easy interface to modify the URI endpoints to auth.
   If you change the website or port for oauth then this file can help you
   to easily change the URI the oauth the user server relies on.
*/
const URI = 'http://localhost:3002/auth'

const URI_auth_code = (URI + '/auth_code')
const URI_login = (URI + '/login')
const URI_refresh = (URI + '/refresh')
const URI_verify = (URI + '/verify')

module.exports = {
   URI_auth_code,
   URI_login,
   URI_refresh,
   URI_verify,
}
