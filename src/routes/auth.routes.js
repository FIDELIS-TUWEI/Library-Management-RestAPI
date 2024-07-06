const express = require("express");
const router = express.Router();
const { validateSignup, validateLogin } = require("../validators/auth.validator");
const { signup, login, logout, getMe } = require("../controllers/auth.controller");
const protectMe = require("../middleware/protectRoute");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/me", protectMe, getMe);

module.exports = router;