const asyncHandler = require("express-async-handler");
const Book = require("../models/book.model");
const logger = require("../utils/logger");
const User = require("../models/user.model");

// logic to calculate return date
const calculateReturnDate = (borrowDate, durationOfBorrow) => {
    const duration = parseInt(durationOfBorrow, 10);
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + duration);
    return returnDate;
}

// Borrow a book
// @desc Borrow a book
// @route POST /books/:bookId/borrow
// @access Private (authenticated users only)
const borrowBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user._id;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    // Check if the book is available
    if (!book.available) {
        return res.status(400).json({ status: 'error', message: 'Book is not available for borrowing' });
    }

    // Update book quantity and availability
    book.quantity -= 1;
    book.available = book.quantity > 0;
    await book.save();

    const user = await User.findById(userId);
    user.borrowedBooks.push(book);
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Book borrowed successfully',
        data: {
            book,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }
    });
});
// Return a borrowed book
// @desc Return a book
// @route PUT /books/:bookId/return
// @access Private (authenticated users only)
const returnBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user._id;

    // Check if the book exists and is borrowed by the user
    const book = await Book.findById(bookId);
    if (!book || book.available) {
        return res.status(404).json({ status: 'error', message: 'Book not found or not borrowed by the user' });
    }

    // Update book quantity and availability
    book.quantity += 1;
    book.available = true;
    await book.save();

    const user = await User.findById(userId);
    user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== bookId);
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Book returned successfully',
        data: {
            book,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }
    });
});


module.exports = {
    borrowBook, returnBook
}