const express = require("express");
const router = express.Router();
const { validateUserInput } = require("../validators/auth.validator");
const { signup } = require("../controllers/auth.controller");

router.post("/signup", validateUserInput, signup);

module.exports = router;