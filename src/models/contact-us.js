const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contactUsSchema = new Schema({
    type: {
        type: String,
        enum: ['phone', 'email', 'whatsapp']
    },
    value: {
        type: String
    }
}, { timestamps: false });
const contactUsModel = mongoose.model("contact_us", contactUsSchema);
module.exports = contactUsModel;