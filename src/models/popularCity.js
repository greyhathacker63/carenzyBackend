const mongoose = require('mongoose');

const popularCitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    image :{
        type :String
    }
}, {
    versionKey: false,
});

module.exports = mongoose.model('popular_city', popularCitySchema);