const jwt = require("jsonwebtoken");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const JWT_PUBLIC_KEY_BASE64 = process.env.JWT_PUBLIC_KEY_BASE64;


function verifyJwt(req, res, next) {
    // parse jwt
    const cookieHeader = req.cookies;
    const jwtToken = (cookieHeader.acces_token) ? cookieHeader.acces_token : undefined;

    if (!jwtToken) {
        return res.status(401).json({ error: 'Missing auth token' });
    }

    // decode jwt public key
    const JWT_PUBLIC_KEY = Buffer.from(JWT_PUBLIC_KEY_BASE64, 'base64').toString();
    
    // validate jwt
    jwt.verify(jwtToken, JWT_PUBLIC_KEY, (error, result) => {
        // invalid jwt
        if (error) return res.status(401).json({ message: "Invalid jwt" });

        // valid jwt
        req.user = result;
    });

    next();
}

module.exports = verifyJwt;