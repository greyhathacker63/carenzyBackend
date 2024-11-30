const { Schema, model, Types } = require('mongoose');

const dealerLeadSchema = new Schema({
    dealerFromId: {
		type: Types.ObjectId,
		ref: "dealer"
	},
    dealerToId: {
		type: Types.ObjectId,
		ref: "dealer"
	},
    dealerCarId: {
		type: Types.ObjectId,
		ref: "dealer"
	},
    phone: {
		type: String,
		trim: true,
	}
}, { timestamps: true });


const dealerLeadModel = model('dealer_leads', dealerLeadSchema);
module.exports = dealerLeadModel;