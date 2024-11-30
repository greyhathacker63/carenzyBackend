const { Schema, model, Types } = require('mongoose');

const RTOSchema = new Schema({
    stateId: {
        type: Types.ObjectId,
        ref: "states"
    },
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
    },
    status: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const RTOModel = model('rto', RTOSchema);
module.exports = RTOModel;