const { Schema, model, Types, } = require('mongoose');
const dealerFcmTokenSchema = new Schema({
    dealerLoginId: {
        type: Types.ObjectId,
        ref: "dealer_login"
    },
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    token: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const dealerFcmTokenModel = model('dealer_fcm_token', dealerFcmTokenSchema);
module.exports = dealerFcmTokenModel;