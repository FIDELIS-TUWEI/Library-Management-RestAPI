const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const borrowSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: ObjectId,
        ref: "Book",
        required: true
    },
    durationOfBorrow: {
        type: String,
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now(),
    },
    returnDate: {
        type: Date
    }
},
{ timestamps: { createdAt: "Date_created", updatedAt: "Date_updated" } },
);

module.exports = mongoose.model("Borrow", borrowSchema)