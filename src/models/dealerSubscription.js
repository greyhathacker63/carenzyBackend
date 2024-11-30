const { Schema, model, Types } = require('mongoose');

const dealerSubscriptionSchema = new Schema({
    planId: {
        type: Types.ObjectId,
        ref: "plans"
    },
    dealerId: {
        type: Types.ObjectId,
        ref: "dealers"
    },
    transactionid: {
        type: Types.ObjectId,
        ref: "transactions"
    },
    name: {
        type: String
    },
    duration: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    benefits: [
        {
            type: String
        }
    ],
    status: [
        {
            type: String,
            enum: ['Pending', 'Purchased', 'Approved', 'Rejected'],
            default: 'Pending'
        }
    ],
    isByAdmin: {
        type: Boolean
    },
    ammountInBank: {
        type: String
    },
    receipt: {
        type: String
    },
    allotAdminId: {
        type: Types.ObjectId,
        ref: "admins"
    },
    rejectionReason: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const dealerSubscription = model('dealerSubscription', dealerSubscriptionSchema);

module.exports = dealerSubscription