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


const dealerCarBookmarkModel = model('dealer_car_bookmark', ModelSchema);
module.exports = dealerCarBookmarkModel;