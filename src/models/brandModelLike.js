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


const brandModelLikeModel = model('brand_model_like', ModelSchema);
module.exports = brandModelLikeModel;