const { Schema, model, Types, } = require('mongoose');
const brandModel = require("./brandModel")
const ModelVariantSchema = new Schema({
    brandId: {
        type: Types.ObjectId,
        ref: "brands"
    },
    brandModelId: {
        type: Types.ObjectId,
        ref: "brand_model"
    },
    fuelTypeId: {
        type: Types.ObjectId,
        ref: "fuel_type"
    },
    engineTypeId: {
        type: Types.ObjectId,
        ref: "engine_type"
    },
    name: {
        type: String,
        trim: true
    },
    // year: {
    //     type: String,
    //     trim: true
    // },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

ModelVariantSchema.post("save", async function (doc, next) {
    try {
        doc.brandId = (await brandModel.findById(doc.brandModelId)).brandId;
        doc.save();
        next();
    } catch (err) {
        throw new Error("Error while getting brand info of the seleced model");
    }
});
const modelVariantModel = model('model_variant', ModelVariantSchema);
module.exports = modelVariantModel;