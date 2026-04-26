const express = require("express");
const app = express();

const registerAccountRoutes = require("./api/routes/register_account.js");
const callbackRoutes = require("./api/routes/google_callback.js");

app.use(express.json());

app.use("/api/create_account", registerAccountRoutes);
app.use("/api/google_callback", callbackRoutes);

module.exports = app;