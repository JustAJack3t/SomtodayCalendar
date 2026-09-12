const verifyJwt = require("./verify_jwt.js");
const verifyCsrfToken = require("./verify_csrf_token.js");

function requireAuth(req, res, next) {
    verifyJwt();
    verifyCsrfToken();
    
    next();
}

module.exports = requireAuth;