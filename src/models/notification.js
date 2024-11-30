const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	dealerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer"
	},
	fromDealerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer"
	},
	dealerCarId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer_car"
	},
	marketPlaceId: {
		type: mongoose.Types.ObjectId,
		ref: "market_place_live"
	},
	biddingLiveId: {
		type: mongoose.Types.ObjectId,
		ref: "bidding_live"
	},
	offerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer_car_offer"
	},
	biddingId: {
		type: mongoose.Types.ObjectId,
		ref: "bidding"
	},
	title: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	type: {
		type: String,
		enum: ["General", "Car In Bidding", "Car In Market", "Market Offer Received", "Bidding Offer Received"],
		default: "General"
	},
	isRead: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;