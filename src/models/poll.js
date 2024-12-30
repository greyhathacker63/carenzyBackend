const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ansSchema = new Schema({
    answer: {
        type: String,
    },
    count: {
        type: Number,
        default: 0
    }
}, { _id: false });

const pollSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        answers: [ansSchema],
    },
    {
        timestamps: true,
        answers: [ansSchema],
    },
);

module.exports = mongoose.model('poll', pollSchema);
