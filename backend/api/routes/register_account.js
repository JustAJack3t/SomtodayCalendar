const express = require("express");
const router = express.Router();
const createAccount = require("./../models/register_account.js");


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

    // send res
    res.status(200).json({ message: "Account created"});
});

module.exports = router;