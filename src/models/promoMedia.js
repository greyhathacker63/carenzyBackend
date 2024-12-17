const mongoose = require('mongoose');

const { Schema } = mongoose;

const promoMediaSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        state_name: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        is_deleted:{
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);


module.exports = mongoose.model('PromoMedia', promoMediaSchema);
