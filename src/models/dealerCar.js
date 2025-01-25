const mongoose = require("mongoose");
const dealerCarSchema = new mongoose.Schema({
	dealerId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer"
	},
	brandId: {
		type: mongoose.Types.ObjectId,
		ref: "brand"
	},
	modelId: {
		type: mongoose.Types.ObjectId,
		ref: "brand_model"
	},
	variantId: {
		type: mongoose.Types.ObjectId,
		ref: "model_variant"
	},
	// colorId: {
	// 	type: mongoose.Types.ObjectId,
	// 	ref: "color"
	// },
	rtoId: {
		type: mongoose.Types.ObjectId,
		ref: "rto"
	},
	stateId: {
		type: mongoose.Types.ObjectId,
		ref: "state"
	},
	// cityId: {
	// 	type: mongoose.Types.ObjectId,
	// 	ref: "city"
	// },
	fuelTypeId: {
		type: mongoose.Types.ObjectId,
		ref: "fuel_type"
	},
	// type: [{
	// 	type: String,
	// 	enum: ['Market', 'Bidding']
	// }],
	underHypothecation: {
		type: Boolean,
		default: false
	},
	// registrationNumber: {
	// 	type: String,
	// 	trim: true,
	// },
	// collaboration: {
	// 	type: String,
	// 	trim: true,
	// },
	// information: {
	// 	type: String,
	// 	trim: true
	// },
	askingPrice: {
		type: Number,
	},
	// biddingIncGap: {
	// 	type: Number,
	// 	default: 5000,
	// },
	// location: {
	// 	type: String,
	// 	trim: true
	// },
	// locationDealer: {
	// 	type: String,
	// 	trim: true
	// },
	// manufacturingMonth: {
	// 	type: String,
	// 	trim: true
	// },
	// manufacturingYear: {
	// 	type: String,
	// 	trim: true
	// },
	// registrationMonth: {
	// 	type: String,
	// 	trim: true
	// },
	// registrationYear: {
	// 	type: String,
	// 	trim: true
	// },
	// insuranceExpiryMonth: {
	// 	type: String,
	// 	trim: true
	// },
	// insuranceExpiryYear: {
	// 	type: String,
	// 	trim: true
	// },
	insuranceType: {
		type: String,
		enum: ["Comprehensive", "Zero Depreciation", "3rd Party", "Insurance Expired"]
	},
	bonusNotClaimed: {
		type: Boolean,
		default: true
	},
	bonusNotClaimedPercentage: {
		type: Number,
		default: 0,
		min: 0,
		max: 100
	},
	kmsDriven: {
		type: Number,
		trim: true
	},
	// paintedPiecesCount: {
	// 	type: Number,
	// 	default: 0,
	// 	trim: true
	// },
	transmissionType: {
		type: String,
		enum: ["Automatic", "Manual"],
		default: "Automatic"
	},
	keys: {
		type: Number,
		default: 1
	},
	numberOfOwners: {
		type: Number,
	},
	thumbnailImage: {
		type: String,
		trim: true
	},
	interiorImageVideos: [{
		type: String,
		trim: true
	}],
	exteriorImageVideos: [{
		type: String,
		trim: true
	}],
	engineImageVideos: [{
		type: String,
		trim: true
	}],
	// rcAvailibity: {
	// 	type: String,
	// 	enum: ["Original", "Duplicate", "Lost"],
	// 	default: "Original"
	// },
	// ownershipType: {
	// 	type: String,
	// 	enum: ["First", "Second", "Third"],
	// 	default: "First"
	// },
	// rcImages: [{
	// 	type: String,
	// }],
	// chassisNumber: {
	// 	type: String,
	// 	trim: true
	// },
	// chassisImages: [{
	// 	type: String,
	// }],
	// chassisNumberEmbossing: {
	// 	type: String,
	// 	enum: ["OK", "Rusted", "Repunched", "No Traceable", "Mis Match", "Incomplete"],
	// 	default: "OK"
	// },
	// insuranceImages: [{
	// 	type: String,
	// }],
	// additionalPhotos: [{
	// 	type: String,
	// }],
	// additionInformation: {
	// 	type: String,
	// 	default: null
	// },
	// reportAlreadyPainted: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportPaintingRequired: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportPieceChange: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportStearing: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportSuspension: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportEngine: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportAC: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportRusting: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportTyres: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportSunroof: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportInterior: {
	// 	type: String,
	// 	trim: true,
	// },
	// reportRefurb: {
	// 	type: String,
	// 	trim: true,
	// },
	reportDescription: {
		type: String,
		trim: true,
	},
	status: {
		type: String,
		enum: ["In List", "Sold", "Paused", "Inactive", "Removed"],
		default: "In List"
	},
	approved: {
		type: Boolean,
		default: false
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	year:{
		type: String,
	},
	modifiedPrice:{
		type: Number,
	},
	insuranceDate:{
		type: String,
	}
}, { timestamps: true });

// dealerCarSchema.index({ 'dealerId': 1 });
// dealerCarSchema.index({ 'brandId': 1 });
// dealerCarSchema.index({ 'modelId': 1 });
// dealerCarSchema.index({ 'variantId': 1 });
dealerCarSchema.index({ 'transmissionType': 1 });
dealerCarSchema.index({ 'status': 1 });
dealerCarSchema.index({ 'chassisNumberEmbossing': 1 });
const dealerCarModel = mongoose.model("dealer_car", dealerCarSchema);
module.exports = dealerCarModel;