const { Schema, model, } = require('mongoose');

const testimonialSchema = new Schema({
    userId: {
        type: String
    },
    url: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const testimonialModel = model('testimonials', testimonialSchema);
module.exports = testimonialModel;