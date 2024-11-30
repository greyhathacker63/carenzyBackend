const { Schema, model, Types, } = require('mongoose');

const ModelSchema = new Schema({
    dealerCarId: {
        type: Types.ObjectId,
        ref: "dealer_car"
    },
    dealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
}, { timestamps: true });


const dealerCarLike = model('dealer_car_like', ModelSchema);
module.exports = dealerCarLike;