const mongoose = require("mongoose");
const BannerSchema = new mongoose.Schema(
	{
		position: {
			type: String,
			enum: ["home", "bidding", "market", "leads"],
		},
		visibleTo: {
			type: String,
			enum: ["Unverified Accounts", "Incomplete Accounts", "Verified / Complete Accounts", "All Accounts"]
		},
		url: {
			type: String,
			trim: true
		},
		redirectUrl: {
			type: String,
			trim: true
		},
		index: {
			type: Number
		},
		status: {
			type: Boolean,
			default: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		is_app:{
			type: Boolean,
			required: true
		}
	},
	{ timestamps: true }
);

const bannerModel = mongoose.model("banner", BannerSchema);
module.exports = bannerModel;
