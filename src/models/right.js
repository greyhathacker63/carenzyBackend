const { Schema, model,Types} = require('mongoose');

const rightSchema = new Schema({
    name: {
        type: String
    },
    rightGrpId: {
        type: Types.ObjectId,
        ref: "right-group"
    },
    code: {
        type: String
    }
}, { timestamps: true });


const rightModel = model('right', rightSchema);
module.exports = rightModel;