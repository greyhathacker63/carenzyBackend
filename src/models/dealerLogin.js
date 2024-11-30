const { Schema, model, Types, } = require('mongoose');
const dealerLoginSchema = new Schema({
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    phone: {
        type: String,
    },
    ip: {
        type: String,
        trim: true
    },
    otp: {
        value: {
            type: String
        },
        time: {
            type: Date
        }
    },
    dateTime: {
        type: Date
    }
}, { timestamps: true });

const dealerLoginModel = model('dealer_login', dealerLoginSchema);
module.exports = dealerLoginModel;