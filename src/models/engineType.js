const { Schema, model, Types } = require('mongoose');

const engineTypeSchema = new Schema({
    brandId: {
        type: Types.ObjectId,
        ref: "brands"
    },
    name: {
        type: String
    },
    status: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const engineTypeModel = model('engine_type', engineTypeSchema);
module.exports = engineTypeModel;