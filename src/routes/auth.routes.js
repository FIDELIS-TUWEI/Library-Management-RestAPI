const express = require("express");
const router = express.Router();
const { validateSignup, validateLogin } = require("../validators/auth.validator");
const { signup, login } = require("../controllers/auth.controller");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

module.exports = router;