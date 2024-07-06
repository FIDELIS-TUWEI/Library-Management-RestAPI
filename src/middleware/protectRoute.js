const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const config = require("../utils/config");
const logger = require("../utils/logger");
const User = require("../models/user.model");


// @desc auth middleware to protect routes
const protectMe = asyncHandler (async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ status: "error", message: "Unauthorized. No token provided!" });
        };

        const decoded = await jwt.verify(token, config.JWT_SECRET);

        // check token validity
        if (!decoded) {
            return res.status(401).json({ status: "error", message: "Unauthorized. Invalid token" });
        };

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found!" });
        };

        req.user = user;
        next();
    } catch (error) {
        logger.error("Error in protect middleware", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

module.exports = protectMe;