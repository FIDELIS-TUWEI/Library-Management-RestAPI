const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

const checkRole = (roles) => asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!roles.includes(user.role)) {
        return res.status(403).json({ status: "error", message: "Forbidden: You're not authorized to perform this action!" });
    }

    next();
});

module.exports = { checkRole };
