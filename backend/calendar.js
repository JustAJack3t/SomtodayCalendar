// imports dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// gets somtoday key from .env file
const GOOGLE_KEY = process.env.GOOGLE_KEY;
const CLIENT_ID = process.env.CLIENT_ID;

