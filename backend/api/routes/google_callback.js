const express = require("express");
const router = express.Router();
const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT;


router.get("/", async (req, res, next) => {
    if (req.query.error) {
        console.log(`Error: ${req.query.error}`);
        res.json({
            message: "An error occured"
        });
    }

    else if (req.query.code) {
        const code = req.query.code;
        console.log(`Code: ${code}`);
        res.json({
            message: "authorization succesful"
        });

        const response = await fetch(
            `https://oauth2.googleapis.com/token`, {
                method: "post",
                body: (new URLSearchParams({
                    code: code,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    redirect_uri: `http://localhost:${PORT}/api/google_callback`,
                    grant_type: "authorization_code"
                }))
            }
        );
        req.app.locals
        const tokens = await response.json();
        console.log(tokens);
    }

    else {
        res.json({
            message: "Insufficient queries"
        });
        console.log("Insufficient queries");
    }
});


module.exports = router;