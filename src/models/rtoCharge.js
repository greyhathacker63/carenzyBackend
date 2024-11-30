const { Schema, model, Types } = require('mongoose');

const RTOchargeSchema = new Schema({
    stateId: {
        type: Types.ObjectId,
        ref: "states"
    },
    rtoId: {
        type: Types.ObjectId,
        ref: "rtos"
    },
    fuleTypeId: {
        type: Types.ObjectId,
        ref: "fuletypes"
    },
    registrationType: {
        type: String,
        enum: ["individual", "company", "NGO"],
        default: "individual"
    },
    minPrice: {
        type: Number,
        default: 0
    },
    maxPrice: {
        type: Number,
        default: 0
    },
    taxPercentage: {
        type: Number,
        default: 0
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


const RTOchargeModel = model('RTOcharge', RTOchargeSchema);
module.exports = RTOchargeModel;