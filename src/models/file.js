const { Schema, model } = require('mongoose');

const modelSchema = new Schema({
    uid: {
        type: String,
        default: Date.now()
    },
    name: {
        type: String,
    },
    url: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: false });


const fileModel = model('file', modelSchema);
module.exports = fileModel;