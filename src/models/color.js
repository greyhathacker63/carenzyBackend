const { Schema, model, Types } = require('mongoose');

const colorSchema = new Schema({
    brandId: {
        type: Types.ObjectId,
        ref: "brands"
    },
    name: {
        type: String
    },
    hexCode: {
        type: String
    },
    status: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const colorModel = model('color', colorSchema);
module.exports = colorModel;