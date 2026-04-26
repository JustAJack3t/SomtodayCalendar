const express = require("express");
const router = express.Router();
const createAccount = require("./../models/register_account.js");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const PORT = process.env.PORT;


router.post("/", (req, res) => {
    // parse the body
    const { firstName, lastName, eMail, password } = req.body;

    // error handling
    if( !firstName || !lastName || !eMail || !password) {
        return res.status(400).json({ error: "Missing parameter in the body"});
    }

    // create account
    const result = createAccount(firstName, lastName, eMail, password);

    // catch errors
    if (result === false) {
        return res.status(500).json({ error: "Adding account to the database failed"});
    }

    // send res
    res.json({ message: "Account created"});
});

module.exports = router;