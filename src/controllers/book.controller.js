const asyncHandler = require("express-async-handler");
const Books = require("../models/book.model");
const logger = require("../utils/logger");

// @desc add books
const addBook = asyncHandler (async (req, res) => {
    try {
        const { title, author, genre, publicationDate, quantity } = req.body;

        const foundTitle = await Books.findOne({ title })
        if (foundTitle) {
            return res.status(400).json({
                status: "error",
                message: `Book with title: ${title} already exists, please add another title.`
            });
        };

        const newBook = new Books({
            title,
            author, 
            genre,
            publicationDate, 
            quantity
        });

        await newBook.save();

        res.status(201).json({
            status: "success",
            message: `New Book with title: ${title} has been added successfully to you library.`,
            data: newBook
        });
    } catch (error) {
        logger.error("Error on addBook controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// @desc get books
const getBooks = asyncHandler (async (req, res) => {
    try {
        const { title, author, genre, available, random } = req.query;

        let filter = {};

        if (title) {
            filter.title = new RegExp(title, "i");
        };

        if (author) {
            filter.author = new RegExp(author, "i");
        };

        if (genre) {
            filter.genre = new RegExp(genre, "i");
        };

        if (available) {
            filter.available = available === "true";
        };

        if (random) {
            const count = await Books.countDocuments(filter);
            const randomIndex = Math.floor(Math.random() * count);
            const randomBook = await Books.findOne(filter).skip(randomIndex);
            return res.status(200).json({
                status: "success",
                message: "Fetched Random Books successfully",
                data: randomBook
            });
        }

        const books = await Books.find(filter);

        res.status(200).json({
            status: "success",
            message: "All books fetched successfully",
            count: books.length,
            data: books
        })
    } catch (error) {
        logger.error("Error in getBooks controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// @desc get book by ID
const getBookByID = asyncHandler (async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Books.findById(bookId);

        if (!book) {
            return res.status(404).json({ status: "error", message: `Book with ID: ${bookId} not found` });
        };

        res.status(200).json({
            status: "success",
            message: `Book with Title: ${book.title} fetched successfully.`,
            data: book
        });

    } catch (error) {
        logger.error("Error on getBookById controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" })
    }
});

// @desc update book
const updateBook = asyncHandler (async (req, res) => {
    try {
        const { bookId } = req.params;
        const updatedBook = await Books.findByIdAndUpdate(bookId, req.body, { new: true, runValidators: true });

        if (!updatedBook) {
            return res.status(404).json({
                status: "error",
                message: `Failed to update book with ID: ${bookId}, book not found.`
            });
        };

        res.status(200).json({
            status: "success",
            message: `Book with Title: ${updatedBook.title} updated successfully.`,
            data: updatedBook
        });

    } catch (error) {
        logger.error("Error on updateBook controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
});

// @desc delete book
const deleteBook = asyncHandler (async (req, res) => {
    try {
        const { bookId } = req.params;
        const removeBook = await Books.findByIdAndDelete(bookId);

        if (!removeBook) {
            return res.status(404).json({
                status: "error",
                message: `Failed to delete book with ID: ${bookId}, book does not exist.`
            });
        };

        res.status(200).json({
            status: "success",
            message: `Book with Title: ${removeBook.title} removed from your library successfully`
        })
    } catch (error) {
        logger.error("Error on deleteBook controller", error);
        return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
    }
})

module.exports = {
    addBook, getBooks, getBookByID, updateBook, deleteBook
};