const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const citySchema = new Schema({
    name: {
        type: String,
    },
},
    { _id: false });

const stateSchema = new Schema({
    state: {
        type: String,
        ref: 'states',
        required: true
    },
    cities: [citySchema]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('state_city', stateSchema);
