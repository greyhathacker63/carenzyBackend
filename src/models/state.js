const { Schema, model, } = require('mongoose');

const stateSchema = new Schema({
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


const stateModel = model('state', stateSchema);
module.exports = stateModel;