const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const logger = require("../utils/logger");

// @desc get all users
const getUsers = asyncHandler (async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({ 
            status: "success",
            message: "All users fetched successfully",
            data: users
        })
    } catch (error) {
        logger.error("Error in getUsers controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    };
});

// @desc get user by ID
const getUserById = asyncHandler (async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ status: "error", message: `User with ID: ${userId} not found.` });
        };

        res.status(200).json({
            status: "success",
            message: `User by first name: ${user.firstName} fetched successfully`,
            data: user
        });

    } catch (error) {
        logger.error("Error in getUUserById controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// @desc update user by ID
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = { ...req.body };

        if ('role' in updateData) {
            if (req.user.role !== 'Admin') {
                delete updateData.role;
                return res.status(403).json({
                    status: "error",
                    message: "Only Admin users can update roles."
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: `User with Id: ${userId} not found.`
            });
        }

        return res.status(200).json({
            status: "success",
            message: `User with first name: ${updatedUser.firstName} updated successfully`,
            data: updatedUser
        });

    } catch (error) {
        logger.error("Error in updateUser controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// @desc update user passsword
const changePassword = asyncHandler (async (req, res) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ error: "Please enter password!" })
        } 
    
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true, runValidators: true });

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
            data: updateUser
        });

    } catch (error) {
        logger.error("Error in changePassword controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" })
    }
})


module.exports = {
    getUsers, getUserById, updateUser, changePassword
};