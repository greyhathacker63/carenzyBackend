const { Schema, model } = require('mongoose');

const metadataSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
        enum: ["dealership-registration-certificate", "report-problem"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: false });

const metadataModel = model('metadata', metadataSchema);

module.exports = metadataModel;