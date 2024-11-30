const { Schema, model, } = require('mongoose');

const fuleTypeSchema = new Schema({
    name: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const fuleTypeModel = model('fuel_type', fuleTypeSchema);
module.exports = fuleTypeModel;