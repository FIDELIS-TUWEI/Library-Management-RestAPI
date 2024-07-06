const express = require("express");
const protectMe = require("../middleware/protectRoute");
const { getUsers, getUserById, updateUser, changePassword } = require("../controllers/user.controller");
const { checkRole } = require("../middleware/checkRole");
const router = express.Router();

router.get("/", protectMe, checkRole(["Admin"]), getUsers);
router.get("/:userId", protectMe, getUserById);
router.put("/:userId", protectMe, updateUser);
router.put("/:id", protectMe, changePassword);

module.exports = router;