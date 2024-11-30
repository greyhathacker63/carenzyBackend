const mongoose = require("mongoose");
const biddingSchema = new mongoose.Schema({
	dealerCarId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer_car"
	},
	startTime: {
		type: Date
	},
	endTime: {
		type: Date
	},
	lastBid: {
		type: Number,
		default : 0
	}
}, { timestamps: true });

const biddingLiveModel = mongoose.model("bidding_live", biddingSchema);
module.exports = biddingLiveModel;