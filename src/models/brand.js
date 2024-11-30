const { Schema, model, } = require('mongoose');

const brandSchema = new Schema({
    name: {
        type: String
    },
    icon: {
        type: String
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


const brandModel = model('brand', brandSchema);
module.exports = brandModel;