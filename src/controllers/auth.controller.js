const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const User = require("../models/user.model");

// Register user
// @desc
// @Access /auth/signup
const signup = asyncHandler (async (req, res) => {
    try {
        // check and ensure user is unique
        const { email } = req.body;

        const duplicateUser = await User.findOne({ email });
        if (duplicateUser) {
            return res.status(409).json({ status: "error", message: `Email address: ${email} is already registered!` });
        };

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user object
        const user = new User({
            email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            password: hashedPassword
        });

        // save user to db
        await user.save();

        res.status(201).json({
            status: "success",
            message: "User registration successful",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        
    } catch (error) {
        logger.error("Error in signup controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// Login user
// @desc
// @Access /auth/login
const login = asyncHandler (async (req, res) => {});

module.exports = {
    signup, login
};