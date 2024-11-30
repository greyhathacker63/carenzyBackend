const { Schema, model,Types } = require('mongoose');

const roleSchema = new Schema({
    rightCodes: [{
        type: String
    }],
    name: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const roleModel = model('role', roleSchema);
module.exports = roleModel;