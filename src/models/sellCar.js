const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const sellCarSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        registration_number: {
            type: String,
            unique: true,
            uppercase: true,
            trim: true
        },
        make: {
            type: String,
            required: true,
            trim: true
        },
        model: {
            type: String,
            required: true,
            trim: true
        },
        variant: {
            type: String,
            trim: true
        },
        transmission: {
            type: String,
            enum: ['automatic', 'manual'],
            required: true
        },
        year: {
            type: Number,
            required: true,
            min: 1900,
            max: new Date().getFullYear()
        },
        fuel: {
            type: Types.ObjectId,
            required: true
        },
        user_id:{
            type: Types.ObjectId,
            required: true,
            trim: true
        },
        no_of_owner: {
            type: Number,
            required: true,
            min: 1
        },
        expected_price: {
            type: Number,
            required: true,
            min: 0
        },
        plan_to_sell: {
            type: String,
            trim: true
        },
        image: {
            type: [String],
            trim: true
        },
        mobile:{
            type: String,
            required: true,
            trim: true
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Sell_car', sellCarSchema);
