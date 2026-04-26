const { Client } = require("pg");
const bcrypt = require("bcrypt");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const HOST = process.env.DBHOST;
const USER = process.env.DBUSER;
const PORT = process.env.DBPORT;
const PASSWORD = process.env.DBPASSWORD;
const DATABASE = process.env.DBDATABASE;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

// connect to database
const client = new Client({
    host: HOST,
    user: USER,
    port: PORT,
    password: PASSWORD,
    database: DATABASE
});

client.connect();

async function createUser(firstName, lastName, eMail, password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const dbQuery = `INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4);`;

    try {
        await client.query(dbQuery, [eMail, hashedPassword, firstName, lastName]);
        return true;

    } catch (error) {
        
        console.log(`An error occured: ${error.message}\n`);
        return false;
    }
    

    await client.end();
}

module.exports = createUser;