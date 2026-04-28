const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const registerAccountRoutes = require("./api/routes/register_account.js");
const loginAccountRoutes = require("./api/routes/login_account.js");
const tokenLoginRoutes = require("./api/routes/token_login.js");
const callbackRoutes = require("./api/routes/google_callback.js");

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/register", registerAccountRoutes);
app.use("/api/auth/login", loginAccountRoutes);
app.use("/api/auth/token", tokenLoginRoutes);
app.use("/api/google_callback", callbackRoutes);

module.exports = app;