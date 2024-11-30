const { Schema, model } = require('mongoose');

const modelSchema = new Schema({
    type: {
        type: String,
        enum: ['aboutus', 'termcondition', 'privacy-policy']
    },

    data: String,
}, { timestamps: false });

const application = model('application', modelSchema);

module.exports = application;