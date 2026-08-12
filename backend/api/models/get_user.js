const { Pool } = require("pg");

// import env variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const HOST = process.env.DBHOST;
const USER = process.env.DBUSER;
const PORT = process.env.DBPORT;
const PASSWORD = process.env.DBPASSWORD;
const DATABASE = process.env.DBDATABASE;

// connect to database
const pool = new Pool({
    host: HOST,
    user: USER,
    port: PORT,
    password: PASSWORD,
    database: DATABASE
});


async function getUser(eMail) {
    // create database query
    const dbQuery = `
    SELECT user_id, first_name, last_name FROM users
    WHERE email = $1;`;

    try {
    // query the database
    const result = await pool.query(dbQuery, [eMail]);

    // parse the result
    const user = { 
        "userId": result.rows[0].user_id,
        "firstName": result.rows[0].first_name,
        "lastName": result.rows[0].last_name
    }

    return user;

    } catch (error) {

        console.log(`A error occured at get_user.js: ${error.message}\n`);
        return;
    }
}

module.exports = getUser;