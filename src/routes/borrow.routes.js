const { borrowBook, returnBook } = require("../controllers/borrow.controller");
const protectMe = require("../middleware/protectRoute");
const validateBorrow = require("../validators/borrow.validator");

const express = require("express");
const router = express.Router();

router.post("/:bookId", protectMe, validateBorrow, borrowBook);
router.put("/:bookId/returns", protectMe, returnBook);


module.exports = router;