const mongoose = require("mongoose");
const dealerCarModel = require("./dealerCar");
const brandModel = require("./brand");
const brandModelModel = require("./brandModel");
const modelVariantModel = require("./modelVariant");

const marketPlaceLiveSchema = new mongoose.Schema({
	dealerCarId: {
		type: mongoose.Types.ObjectId,
		ref: "dealer_car"
	},
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
	colorId: {
		type: mongoose.Types.ObjectId,
		ref: "color"
	},
	rtoId: {
		type: mongoose.Types.ObjectId,
		ref: "rto"
	},
	stateId: {
		type: mongoose.Types.ObjectId,
		ref: "state"
	},
	cityId: {
		type: mongoose.Types.ObjectId,
		ref: "city"
	},
	fuelTypeId: {
		type: mongoose.Types.ObjectId,
		ref: "fuel_type"
	},
	manufacturingMonth: {
		type: String,
		trim: true
	},
	manufacturingYear: {
		type: String,
		trim: true
	},
	registrationMonth: {
		type: String,
		trim: true
	},
	registrationYear: {
		type: String,
		trim: true
	},
	insuranceExpiryMonth: {
		type: String,
		trim: true
	},
	insuranceExpiryYear: {
		type: String,
		trim: true
	},
	transmissionType: {
		type: String,
		enum: ["Automatic", "Manual"],
		default: "Automatic"
	},
	numberOfOwners: {
		type: Number,
	},
	kmsDriven: {
		type: Number,
		trim: true
	},
	askingPrice: {
		type: Number,
	},
	brandName: {
		type: String,
		trim: true
	},
	modelName: {
		type: String,
		trim: true
	},
	location: {
		type: String,
		trim: true
	},
	locationDealer: {
		type: String,
		trim: true
	},
	variantName: {
		type: String,
		trim: true
	},
	startTime: {
		type: Date
	},
	endTime: {
		type: Date
	}
}, { timestamps: true });

marketPlaceLiveSchema.pre('save', async function (next) {

	if (this.dealerCarId) {
		try {
			const carData = await dealerCarModel.findById(this.dealerCarId);

			let brandName = null, modelName = null, variantName = null;
			try { brandName = (await brandModel.findById(carData.brandId))?.name; } catch (error) { }
			try { modelName = (await brandModelModel.findById(carData.modelId))?.name; } catch (error) { }
			try { variantName = (await modelVariantModel.findById(carData.variantId))?.name; } catch (error) { }

			this.dealerId = carData.dealerId;
			this.brandId = carData.brandId;
			this.modelId = carData.modelId;
			this.variantId = carData.variantId;
			this.colorId = carData.colorId;
			this.rtoId = carData.rtoId;
			this.stateId = carData.stateId;
			this.cityId = carData.cityId;
			this.fuelTypeId = carData.fuelTypeId;
			this.manufacturingMonth = carData.manufacturingMonth;
			this.manufacturingYear = carData.manufacturingYear;
			this.registrationMonth = carData.registrationMonth;
			this.registrationYear = carData.registrationYear;
			this.insuranceExpiryMonth = carData.insuranceExpiryMonth;
			this.insuranceExpiryYear = carData.insuranceExpiryYear;
			this.kmsDriven = carData.kmsDriven;
			this.transmissionType = carData.transmissionType;
			this.numberOfOwners = carData.numberOfOwners;
			this.askingPrice = carData.askingPrice;
			this.location = carData.location;
			this.locationDealer = carData.locationDealer;
			this.brandName = brandName;
			this.modelName = modelName;
			this.variantName = variantName;
		} catch (error) {
		}
	}
	next();
});

marketPlaceLiveSchema.index({ 'dealerCarId': 1 });
const marketPlaceLiveModel = mongoose.model("market_place_live", marketPlaceLiveSchema);
module.exports = marketPlaceLiveModel;