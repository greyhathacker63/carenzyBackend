const { Schema, model, } = require('mongoose');

const bodyTypeSchema = new Schema({
    icon: {
        type: String
    },
    name: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const bodyTypeModel = model('body_type', bodyTypeSchema);
module.exports = bodyTypeModel;