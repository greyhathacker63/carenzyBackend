const { Schema, model, Types } = require('mongoose');

const modelSchema = new Schema({
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    type: {
        type: String,
        enum: ["Aadhaar Number", "Aadhaar Card Front", "Aadhaar Card Back", "Pan Card Number", "Pan Card Picture", "Shop Picture", "Dealership Registration Document Photo", "GST Number", "GST Certificate Photo"]
    },
    approvalStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "verified", "rejected"]
    },
    message: {
        type: String,
        trim: true
    },
}, { timestamps: false });

const dealer_data_verification = model('dealer_data_verification', modelSchema);

module.exports = dealer_data_verification;