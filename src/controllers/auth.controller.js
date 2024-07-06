const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const User = require("../models/user.model");
const generateTokenAsCookie = require("../utils/generateToken");

// Register user
// @desc
// @Access /auth/signup
const signup = asyncHandler (async (req, res) => {
    try {
        // check and ensure user is unique
        const { firstName, lastName, email, phone, password } = req.body;

        const duplicateUser = await User.findOne({ email });
        if (duplicateUser) {
            return res.status(409).json({ status: "error", message: `Email address: ${email} is already registered!` });
        };

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user object
        const user = new User({
            email,
            firstName,
            lastName,
            phone,
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
const login = asyncHandler (async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "Invalid email or password" });
        };

        // check if password matches in DB
        const ispasswordMatch = await bcrypt.compare(password, user?.password);
        if (!ispasswordMatch) {
            return res.status(400).json({ status: "error", message: "Invalid email or password" });
        };

        // generate token as cookie
        generateTokenAsCookie(user._id, res);

        res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });

    } catch (error) {
        logger.error("Error in login controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

module.exports = {
    signup, login
};