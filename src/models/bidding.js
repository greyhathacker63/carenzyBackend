const mongoose = require("mongoose");
const biddingSchema = new mongoose.Schema({
	liveBiddingId: {
		type: mongoose.Types.ObjectId,
		ref: "bidding_live"
	},
	dealerCarId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer_car"
	},
	dealerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer"
	},
	bidAmount: {
		type: Number,
	},
	isDeleted:{
		type: Boolean,
		default: false
	}
}, { timestamps: true });

const biddingModel = mongoose.model("bidding", biddingSchema);
module.exports = biddingModel;