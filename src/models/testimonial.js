const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const testimonialSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'dealer',
        required: [true, "Please provide userId"],
        trim: true
    },
    url: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ["customer", "dealer"],
        required: [true, "Please provide type"],
        trim: true
    },
    thumbnail: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = model('Testimonial', testimonialSchema);