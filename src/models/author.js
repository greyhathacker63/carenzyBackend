const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const authorModel = mongoose.model("author", authorSchema);
module.exports = authorModel;