const { Schema, model, } = require('mongoose');

const brandSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: false
    }

}, { timestamps: true });


const brandModel = model('app_feedback', brandSchema);
module.exports = brandModel;