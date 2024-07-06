const jwt = require("jsonwebtoken");
const config = require("./config");

const generateTokenAsCookie = (userId, res) => {
    const token = jwt.sign({ userId }, config.JWT_SECRET, {
        expiresIn: '1d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attackscross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: config.NODE_ENV !== 'development' 
    });
};

module.exports = generateTokenAsCookie;