const http = require("http");

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const port = process.env.PORT;

const app = require("./app.js");

const server = http.createServer(app);
server.listen(port, () => {console.log(`Server started at http://localhost:${port}`)});