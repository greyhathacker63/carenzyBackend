const { Schema, model, Types, } = require('mongoose');

const ratingDealerSchema = new Schema({
    fromDealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    toDealerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    rating: {
        type: Number,
        default: 1
    },
    review: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const ratingDealerModel = model("rating_dealer", ratingDealerSchema);
module.exports = ratingDealerModel;
