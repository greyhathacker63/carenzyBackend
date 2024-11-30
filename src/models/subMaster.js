const { Schema, model, Types } = require('mongoose');

const subMasterSchema = new Schema({
    masterId: {
        type: Types.ObjectId,
        ref: "master"
    },
    dataType: {
        type: String,
        enum: ["radio", "checkbox", "text", "boolean"]
    },
    name: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const subMasterModel = model('sub_master', subMasterSchema);
module.exports = subMasterModel;