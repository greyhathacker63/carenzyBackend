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
        answers: [ansSchema],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('poll', pollSchema);
