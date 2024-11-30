const { Schema, model, Types } = require('mongoose');

const transactionSchema = new Schema({
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    paymentId: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
    },
    date: {
        type: Date,
    },
    receiptUrl: {
        type: String,
        trim: true
    },
    paymentDetails: {
        type: String,
        trim: true
    },
    planDetails: {
        type: String,
        trim: true
    }
}, { timestamps: true });


const transactionModel = model('transaction', transactionSchema);
module.exports = transactionModel;