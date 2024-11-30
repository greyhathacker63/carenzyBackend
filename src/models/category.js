const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    slug: {
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

const authorModel = mongoose.model("category", categorySchema);
module.exports = authorModel;