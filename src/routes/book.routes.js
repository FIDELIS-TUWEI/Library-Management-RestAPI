const express = require("express");
const protectMe = require("../middleware/protectRoute");
const { checkRole } = require("../middleware/checkRole");
const { addBook, getBooks, getBookByID, updateBook, deleteBook } = require("../controllers/book.controller");
const router = express.Router();

router.post("/", protectMe, checkRole(['Librarian', 'Admin']), addBook);
router.get("/", getBooks);
router.get("/:bookId", protectMe, getBookByID);
router.put("/:bookId", protectMe, checkRole(['Librarian', 'Admin']), updateBook);
router.delete("/:bookId", protectMe, checkRole(["Librarian", "Admin"]), deleteBook);

module.exports = router;