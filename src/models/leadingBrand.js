const mongoose = require('mongoose');
const { Schema} = mongoose;

const leadingBrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        logo: {
            type: String,
            required: true,
            trim: true
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    { 
        timestamps: true,
        versionKey: false
     }
);

module.exports = mongoose.model('Leading_brand', leadingBrandSchema);