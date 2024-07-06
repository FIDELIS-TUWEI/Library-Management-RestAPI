const joi = require("joi");

const bookSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    author: joi.string().min(3).max(100).required(),
    publicationDate: joi.date().required(),
    genre: joi.string().min(3).max(50).required(),
    quantity: joi.number().min(0).required(),
    available: joi.boolean().optional(),
    coverImage: joi.string.optional(),
});

const validateBook = validator(bookSchema);

module.exports = validateBook;
