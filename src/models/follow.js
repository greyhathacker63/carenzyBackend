const { Schema, model, Types, } = require('mongoose');

const followSchema = new Schema({
    followerId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    followingId: {
        type: Types.ObjectId,
        ref: "dealer"
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const followModel = model("follow", followSchema);
module.exports = followModel;
