const express = require("express");
const app = express();

const callbackRoutes = require("./api/routes/google_callback.js");

app.use("/api/google_callback", callbackRoutes);

module.exports = app;