const mongoose = require("mongoose");
const dealerCarOfferSchema = new mongoose.Schema({
	marketPlaceLiveId: {
		type: mongoose.Types.ObjectId,
		ref: "market_place_live"
	},
	dealerCarId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer_car"
	},
	dealerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer"
	},
	amount: {
		type: Number,
		default: 0
	}
}, { timestamps: true });

dealerCarOfferSchema.index({ 'dealerCarId': 1 });
const dealerCarOfferModel = mongoose.model("dealer_car_offer", dealerCarOfferSchema);
module.exports = dealerCarOfferModel;