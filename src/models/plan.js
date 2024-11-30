const { Schema, model } = require('mongoose');

const planSchema = new Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    mrp: {
        type: Number
    },
    duration: {
        type: Number
    },
    benefits: [
        {
            type: String
        }
    ],
    numberOfUses: {
        type: Number,
        default: 999999
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: false });

const plan = model('plan', planSchema);

module.exports = plan
