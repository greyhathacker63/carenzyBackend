const { Schema, model, Types, } = require('mongoose');

const ModelSchema = new Schema({
    brandModelId: {
        type: Types.ObjectId,
        ref: "brand_model"
    },
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
}, { timestamps: true });


const brandModelBookmarkModel = model('brand_model_bookmark', ModelSchema);
module.exports = brandModelBookmarkModel;