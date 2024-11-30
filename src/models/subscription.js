const { Schema, model, Types } = require('mongoose');

const subscriptionSchema = new Schema({
    transactionId: {
        type: Types.ObjectId,
        ref: "transaction"
    },
    allotedBy: {
        type: Types.ObjectId,
        ref: "admin"
    },
    planId: {
        type: Types.ObjectId,
        ref: "plan"
    },
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    planName: {
        type: String,
    },
    duration: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    planDetails: {
        type: String,
        trim: true
    },
    transactionDetails: {
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


const subscriptionModel = model('subscription', subscriptionSchema);
module.exports = subscriptionModel;