const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const validateAccount = require("./../models/validate_account.js");
const getUser = require("./../models/get_user.js");
const createAccount = require("./../models/register_account.js");


// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const JWT_PRIVATE_KEY_BASE64 = process.env.JWT_PRIVATE_KEY_BASE64;
const DEVELOPMENT_STATE = process.env.DEVELOPMENT_STATE;



router.post("/", async (req, res) => {
    // parse the body
    const { firstName, lastName, eMail, password } = req.body;

    // error handling
    if( !firstName || !lastName || !eMail || !password) {
        return res.status(400).json({ error: "Missing parameter in the body"});
    }

    // create account
    const result = await createAccount(firstName, lastName, eMail, password);

    // catch errors
    if (result === false) {
        return res.status(500).json({ error: "Adding account to the database failed"});
    }


    // get user
    const user = await getUser(eMail);

    // decode jwt private key
    const JWT_PRIVATE_KEY = Buffer.from(JWT_PRIVATE_KEY_BASE64, 'base64').toString();

    // create jwt
    const jwtToken = jwt.sign(user, JWT_PRIVATE_KEY, { 
        expiresIn: "15m",
        algorithm: "RS256"
    });

    // create csrf token
    const csrfToken = crypto.randomBytes(32).toString("hex");

    console.log(jwtToken);
    console.log(csrfToken);

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

    // send res
    res.status(200).json({ message: "Account created"});
});

module.exports = router;