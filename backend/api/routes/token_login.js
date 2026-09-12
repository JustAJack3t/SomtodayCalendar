const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const requireAuth = require("../middleware/require_auth.js");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const JWT_PUBLIC_KEY_BASE64 = process.env.JWT_PUBLIC_KEY_BASE64;


router.post("/", (req, res) => {
    res.json({ message: req.user });
});


module.exports = router;