const { Schema, model } = require('mongoose');

const rightsGrpSchema = new Schema({
    name: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const rightsModel = model('right-group', rightsGrpSchema);
module.exports = rightsModel;