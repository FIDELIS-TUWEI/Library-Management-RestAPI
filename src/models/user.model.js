const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    borrowedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        }
    ],
    role: {
        type: String,
        enum: ["Librarian", "User", "Admin"],
        default: "User",
    }
},
{ timestamps: { createdAt: "Date_created", updatedAt: "Date_updated" } },
);

module.exports = mongoose.model("User", usersSchema);