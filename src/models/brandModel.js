const { Schema, model, Types, } = require('mongoose');

const ModelSchema = new Schema({
    brandId: {
        type: Types.ObjectId,
        ref: "brands"
    },
    colorIds: [
        {
            type: Types.ObjectId,
            ref: "colors"
        }
    ],
    bodyTypeId: {
        type: Types.ObjectId,
        ref: "bodytypes"
    },
    engineTypeIds: [{
        type: Types.ObjectId,
        ref: "engine_type"
    }],
    fuelTypeIds: [{
        type: Types.ObjectId,
        ref: "fuel_type"
    }],
    name: {
        type: String,
        trim: true
    },
    interiorImgs: [
        {
            name: {
                type: String
            },
            urls: [{
                type: String
            }]
        }
    ],
    exteriorImgs: [
        {
            name: {
                type: String
            },
            urls: [{
                type: String
            }]
        }
    ],
    videos: [
        {
            link: String,
            title: String
        }
    ],
    description: {
        type: String,
        trim: true
    },
    priceRange: {
        start: {
            type: Number,
            default: 100000
        },
        end: {
            type: Number,
            default: 150000
        },
    },
    status: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

ModelSchema.index({ 'brandId': 1 });
ModelSchema.index({ 'colorIds': 1 });
ModelSchema.index({ 'bodyTypeId': 1 });
const brandModelModel = model('brand_model', ModelSchema);
module.exports = brandModelModel;