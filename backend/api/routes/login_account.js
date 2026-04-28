const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const validateAccount = require("./../models/validate_account.js");
const getUser = require("./../models/get_user.js");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const JWT_PRIVATE_KEY_BASE64 = process.env.JWT_PRIVATE_KEY_BASE64;
const DEVELOPMENT_STATE = process.env.DEVELOPMENT_STATE;


router.post("/", async (req, res) => {
    // parse the body
    const { eMail, password } = req.body;
    
    // error handling
    if(!eMail || !password) {
        return res.status(400).json({ error: "Missing parameter in the body"});
    }

    // validate account 
    const isValid = await validateAccount(eMail, password);

    if (!isValid) {
        return res.status(401).json({ message: "Invalid login credentials" });
    }

    // create user
    const user = { userid: await getUser(eMail) };

    // decode jwt private key
    const JWT_PRIVATE_KEY = Buffer.from(JWT_PRIVATE_KEY_BASE64, 'base64').toString();

    // create jwt
    const jwtToken = jwt.sign(user, JWT_PRIVATE_KEY, { 
        expiresIn: "15m",
        algorithm: "RS256"
    });

    // create csrf token
    const csrfToken = crypto.randomBytes(32).toString("hex");

    // send jwt cookie
    res.cookie("acces_token", jwtToken, {
        httpOnly: true,
        secure: DEVELOPMENT_STATE === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    // send csrf cookie
    res.cookie("csrf_token", csrfToken, {
        httpOnly: false,
        secure: DEVELOPMENT_STATE === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    // send info
    res.status(200).json({ message: "jwt & csrf cookies received" });
});


module.exports = router;