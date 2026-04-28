const { Pool } = require("pg");
const bcrypt = require("bcrypt");

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

async function validateAccount(eMail, password) {
    // create database query
    const dbQuery = `
    SELECT password_hash FROM users
    WHERE email = $1;`;

    // get the hashedPassword from the database
    try {
        const dbResult = await pool.query(dbQuery, [eMail]);

        if (dbResult.rows.length > 1) {
            console.log("Duplicate account in db");
            return false;
        }
        else if (dbResult.rows.length === 0) {
            return false;
        }


        // parse the hashed password
        const hashedPassword = dbResult.rows[0].password_hash;

        // check if password is correct
        const bcryptResult = await bcrypt.compare(password, hashedPassword);

        return await bcryptResult;

    } catch (error) {
        
        console.log(`A error occured at validate_account.js: ${error.message}\n`);
        return false;
    }
}

module.exports = validateAccount;