const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ansSchema = new Schema({
    answer: {
        type: String, 
    },
});

const pollSchema = new Schema(
    {
        user_id: {
            type: Types.ObjectId,
            required: true,
        },
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