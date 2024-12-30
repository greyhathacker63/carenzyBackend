const mongoose = require('mongoose');
const { Schema } = mongoose;

const ansSchema = new Schema(
    {
        answer: {
            type: String
        },
        count: {
            type: Number
        },
    },
    {
        _id: false
    }
);

const pollSchema = new Schema(
    {
        question: {
            type: String,
            required: true
        },
        answers: [ansSchema],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('Poll', pollSchema);
