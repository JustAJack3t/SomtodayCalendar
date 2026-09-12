const crypto = require("crypto");


function verifyCsrfToken(req, res, next) {
    // parse csrf token header
    const csrfHeader = req.header("X-Csrf-Token");

    // parse csrf token
    const cookieHeader = req.cookies;
    const csrfToken = (cookieHeader.csrf_token) ? cookieHeader.csrf_token : undefined;

    if (!csrfHeader || !csrfToken) return res.status(401).json({ error: 'Missing csrf token' });

    // create buffer objects from the tokens, because crypto.timingSafeEqual() only takes buffers as input
    const buffer1 = Buffer.from(csrfHeader, "utf-8");
    const buffer2 = Buffer.from(csrfToken, "utf-8");

    if (!crypto.timingSafeEqual(buffer1, buffer2)) return res.status(401).json({ error: 'Invalid csrf token' });

    next();
}

module.exports = verifyCsrfToken;