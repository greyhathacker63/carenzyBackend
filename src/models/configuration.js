const { Schema, model, } = require('mongoose');

const configurationSchema = new Schema({
    type: {
        type: String,
        enum: ['Bidding Duration', 'Market Car Count', 'Add Extra Number In Market Car Count', 'Video Tutorial Url']
    },
    value: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const configurationModel = model('configuration', configurationSchema);
module.exports = configurationModel;