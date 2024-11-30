const { Schema, model, Types, } = require('mongoose');

const citySchema = new Schema({
    stateId: {
        type: Types.ObjectId,
        ref: "states"
    },
    name: {
        type: String
    },
    code: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const cityModel = model('city', citySchema);
module.exports = cityModel;