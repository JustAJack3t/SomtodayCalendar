const crypto = require("crypto");

// a function which checks if 2 csrf tokens are equal in constant time to prevent timing attacks
function verifyCsrfToken(csrfToken1, csrfToken2) {
    // create buffer objects from the tokens, because crypto.timingSafeEqual() only takes buffers as input
    const buffer1 = Buffer.from(csrfToken1, "utf-8");
    const buffer2 = Buffer.from(csrfToken1, "utf-8");

    return crypto.timingSafeEqual(buffer1, buffer2);
}

module.exports = verifyCsrfToken;