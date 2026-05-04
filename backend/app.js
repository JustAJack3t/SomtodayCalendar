const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const FRONTEND_URL1 = process.env.FRONTEND_URL1;
const FRONTEND_URL2 = process.env.FRONTEND_URL2;

// import api routes
const registerAccountRoutes = require("./api/routes/register_account.js");
const loginAccountRoutes = require("./api/routes/login_account.js");
const tokenLoginRoutes = require("./api/routes/token_login.js");
const callbackRoutes = require("./api/routes/google_callback.js");

// CORS stuff
const allowedOrigins = [
    FRONTEND_URL1, 
    `${FRONTEND_URL1.split("://")[0]}://www.${FRONTEND_URL1.split("://")[1]}`, 
    FRONTEND_URL2, 
    `${FRONTEND_URL2.split("://")[0]}://www.${FRONTEND_URL2.split("://")[1]}`
]

app.use((req, res, next) => {
    if (allowedOrigins.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }

    res.header("Access-Control-Allow-Headers", "X-Csrf-Token, Content-Type, origin");

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST");
        return res.status(200).end();
    }

    next();
});

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth/register", registerAccountRoutes);
app.use("/api/auth/login", loginAccountRoutes);
app.use("/api/auth/token", tokenLoginRoutes);
app.use("/api/google_callback", callbackRoutes);

module.exports = app;