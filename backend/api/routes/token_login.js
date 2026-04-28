const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyCsrfToken = require("./../models/verify_csrf_token.js");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const JWT_PUBLIC_KEY_BASE64 = process.env.JWT_PUBLIC_KEY_BASE64;


router.post("/", (req, res) => {
    // parse csrf token header
    const csrfHeader = req.header("X-Csrf-Token");

    // parse jwt cookie
    const cookieHeader = req.cookies;

    // parse jwt
    const jwtToken = (cookieHeader.acces_token) ? cookieHeader.acces_token : undefined;

    // parse csrf token
    const csrfToken = (cookieHeader.csrf_token) ? cookieHeader.csrf_token : undefined;
    
    // check if both cookies exist
    if (!jwtToken || !csrfToken) return res.status(401).json({ message: "Invalid token" });

    // use the verifyCsrfToken function to verify in constant time if the token and header are the same 
    if (!verifyCsrfToken(csrfHeader, csrfToken)) {
        res.status(401).json({ message: "Invalid csrfHeader" });
    }

    // decode jwt public key
    const JWT_PUBLIC_KEY = Buffer.from(JWT_PUBLIC_KEY_BASE64, 'base64').toString();
    
    // validate jwt
    jwt.verify(jwtToken, JWT_PUBLIC_KEY, (error, result) => {
        // invalid jwt
        if (error) return res.json({ message: "Invalid jwt" });

        // valid jwt
        res.json({ message: result });
    });
});


module.exports = router;