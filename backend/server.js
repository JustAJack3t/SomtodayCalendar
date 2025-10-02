const axios = require("axios");
//const qs = require("querystring"); // for parsing/encoding form data

const dotenv = require('dotenv');
dotenv.config();
const SOMTODAY_KEY = process.env.SOMTODAY_KEY;

axios.defaults.withCredentials = true; // enable cookies
const initialUrl = `https://inloggen.somtoday.nl/?auth=${SOMTODAY_KEY}`;

async function step1() {
  const response = await axios.get(initialUrl, {
    maxRedirects: 0, // important to intercept the redirect
    validateStatus: status => status >= 200 && status < 400 // allow 302 responses
  });

  const cookies = response.headers['set-cookie'] || [];
  const prodStickinessCookie = cookies.find(c => c.startsWith('production-authenticator-stickiness'));
  const jsessionidCookie = cookies.find(c => c.startsWith('JSESSIONID'));

  const locationHeader = response.headers['location']; // URL redirected to
  const urlParams = new URLSearchParams(locationHeader?.split('?')[1]);
  const authorization_code = urlParams.get('auth');

  return {
    authorization_code,
    prodStickinessCookie, //idk if i need this, probably not tbh
    jsessionidCookie,
    locationHeader
  };
}

async function main() {
  console.log(await step1());
}

main();