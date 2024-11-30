const { Schema, model, Types } = require('mongoose');

const subMasterSchema = new Schema({
    brandId: {
        type: Types.ObjectId,
        ref: "brand"
    },
    modelId: {
        type: Types.ObjectId,
        ref: "brand_model"
    },
    variantId: {
        type: Types.ObjectId,
        ref: "model_variant"
    },
    masterIds: [{
        _id: {
            type: Types.ObjectId,
            ref: "master"
        },
        subMasterIds: [{
            _id: {
                type: Types.ObjectId,
                ref: "sub_master"
            },
            subMasterDataIds: [{
                _id: {
                    type: Types.ObjectId,
                    ref: "sub_master_data"
                }
            }]
        }]
    }],
    year: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    milage: {
        type: String,
        trim: true
    },
    enginePower: {
        type: String,
        trim: true
    },
    bhp: {
        type: String,
        trim: true
    },
    bodyTypeId: {
        type: Types.ObjectId,
        ref: "body_type"
    },
    price: {
        showroom: {
            type: Number,
            default: 0
        },
        rto: {
            type: Number,
            default: 0
        },
        insurance: {
            type: Number,
            default: 0
        },
        others: {
            type: Number,
            default: 0
        }
    },
    waitingPeriod: {
        type: Number,
        default: 0
    },
    charge: {
        accessories: {
            type: Number,
            default: 0
        },
        miscellaneous: {
            type: Number,
            default: 0
        },
        extendedWarranty: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

subMasterSchema.index({ 'brandId': 1 });
subMasterSchema.index({ 'modelId': 1 });
subMasterSchema.index({ 'variantId': 1 });
subMasterSchema.index({ 'masterIds': 1 });
subMasterSchema.index({ 'masterIds.subMasterIds': 1 });
subMasterSchema.index({ 'masterIds.subMasterIds.subMasterDataIds': 1 });
const subMasterModel = model('variant_spec_feature', subMasterSchema);
module.exports = subMasterModel;