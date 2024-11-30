const { Schema, model } = require('mongoose');

const masterSchema = new Schema({

    name: {
        type: String,
        trim: true
    },
    // status: {
    //     type: Boolean,
    //     default: true
    // },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const masterModel = model('master', masterSchema);
module.exports = masterModel;