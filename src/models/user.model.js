const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
    books: [
        {
            type: ObjectId,
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