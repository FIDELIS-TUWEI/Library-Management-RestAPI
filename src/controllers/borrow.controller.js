const asyncHandler = require("express-async-handler");
const Borrow = require("../models/borrow.model");
const Book = require("../models/book.model");
const logger = require("../utils/logger");

// logic to calculate return date
const calculateReturnDate = (borrowDate, durationOfBorrow) => {
    const duration = parseInt(durationOfBorrow, 10);
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + duration);
    return returnDate;
}

// @desc borrow book
const borrowBook = asyncHandler (async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId).populate("title")

        if (!book || book.quantity <= 0) {
            return res.status(400).json({ status: "error", message: `Book with title: ${book.title} is not available at the moment` });
        };

        const { durationOfBorrow } = req.body;

        if (!durationOfBorrow) {
            return res.status(400).json({ status: "error", message: "Duration of borrow is required" });
        }

        const borrow = new Borrow({ user: req.user._id, book: bookId, durationOfBorrow, returnDate: calculateReturnDate(new Date(), durationOfBorrow) });
        await borrow.save();

        book.quantity -= 1;
        book.available = book.quantity >= 0;

        await book.save();

        res.status(200).json({
            status: "success",
            message: `Book with ID: ${book.title} borrowed successfully. Enjoy reading!`,
            data: borrow
        });

    } catch (error) {
        logger.error("Error on borrowBook controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// @desc return book
const returnBook = asyncHandler (async (req, res) => {
    try {
        const { bookId } = req.params;
        const borrow = await Book.findOne({ user: req.user._id, book: bookId, returnDate: null });

        if (!borrow) {
            return res.status(400).json({
                status: "error",
                message: "Your borrow record can't be found."
            });
        };

        borrow.returnDate = new Date();
        await borrow.save();

        const book = await Book.findById(bookId);
        book.quantity += 1;
        book.available = true;
        await book.save();

        res.status(200).json({
            status: "success",
            message: `The book with title: ${book.title} has successfully been returned to our library. Welcome again!`,
            data: borrow,
        });

    } catch (error) {
        logger.error("Error on returnBook controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

module.exports = {
    borrowBook, returnBook
}