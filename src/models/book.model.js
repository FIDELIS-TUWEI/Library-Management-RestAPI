const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    publicationDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    available: {
        type: Boolean,
        default: true
    },
    coverImage: {
        type: String,
    },
},
{ timestamps: { createdAt: "Date_created", updatedAt: "Date_updated" } },
);

module.exports = mongoose.model("Book", bookSchema);