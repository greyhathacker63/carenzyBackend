const { Types } = require("mongoose");
const dealerCarModel = require("../models/dealerCar");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const marketPlaceLiveModel = require("../models/marketPlaceLive");

class dealerCarModelServices {
	static async details(query) {
		const search = {
			_id: query._id ? Types.ObjectId(query._id) : '',
		};

		clearSearch(search);

		const response = { data: {}, status: false };
		try {
			response.data = await dealerCarModel.findOne({ ...search });
			response.status = true;
			return response;
		} catch (error) {
			throw error
		}
	}

	static async save(data) {
		const _id = data._id;
		const response = { data: {}, status: false };
		try {
			const docData = _id ? await dealerCarModel.findById(_id) : new dealerCarModel();
			docData.dealerId = data.dealerId
			// docData.collaboration = data.collaboration;
			// docData.information = data.information;
			docData.modifiedPrice = data.modifiedPrice;
			docData.askingPrice = data.askingPrice;
			// docData.biddingIncGap = data.biddingIncGap || 5000;
			docData.brandId = data.brandId;
			docData.modelId = data.modelId;
			// docData.manufacturingMonth = data.manufacturingMonth;
			// docData.manufacturingYear = data.manufacturingYear;
			// docData.location = data.location;
			// docData.locationDealer = data.locationDealer;
			// docData.registrationMonth = data.registrationMonth;
			// docData.registrationYear = data.registrationYear;
			docData.variantId = data.variantId;
			docData.year = data.year;
			docData.kmsDriven = data.kmsDriven;
			// docData.paintedPiecesCount = data.paintedPiecesCount;
			docData.fuelTypeId = data.fuelTypeId;
			docData.transmissionType = data.transmissionType;
			docData.keys = data.keys;
			// docData.registrationNumber = data.registrationNumber;
			// docData.biddingIncGap = data.biddingIncGap;
			// docData.type = data.type;
			// docData.colorId = data.colorId;
			docData.rtoId = data.rtoId;
			docData.stateId = data.stateId;
			// docData.cityId = data.cityId;
			docData.numberOfOwners = data.numberOfOwners;
			docData.thumbnailImage = data.thumbnailImage;
			docData.interiorImageVideos = data.interiorImageVideos;
			docData.exteriorImageVideos = data.exteriorImageVideos;
			docData.engineImageVideos = data.engineImageVideos;
			// docData.rcAvailibity = data.rcAvailibity;
			// docData.rcImages = data.rcImages;
			// docData.ownershipType = data.ownershipType;
			// docData.chassisNumber = data.chassisNumber;
			// docData.chassisImages = data.chassisImages
			// docData.chassisNumberEmbossing = data.chassisNumberEmbossing
			// docData.insuranceImages = data.insuranceImages;
			// docData.additionalPhotos = data.AdditionalPhotos;
			// docData.additionInformation = data.AdditionInformation;
			// docData.insuranceExpiryMonth = data.insuranceExpiryMonth;
			// docData.insuranceExpiryYear = data.insuranceExpiryYear;
			docData.insuranceType = data.insuranceType;
			// docData.reportAlreadyPainted = data.reportAlreadyPainted;
			// docData.reportPaintingRequired = data.reportPaintingRequired;
			// docData.reportPieceChange = data.reportPieceChange;
			// docData.reportStearing = data.reportStearing;
			// docData.reportSuspension = data.reportSuspension;
			// docData.reportEngine = data.reportEngine;
			// docData.reportAC = data.reportAC;
			// docData.reportRusting = data.reportRusting;
			// docData.reportTyres = data.reportTyres;
			// docData.reportSunroof = data.reportSunroof;
			// docData.reportInterior = data.reportInterior;
			// docData.reportRefurb = data.reportRefurb;
			docData.reportDescription = data.reportDescription;

			await docData.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
	static async delete(ids) {
		const response = { status: false, ids: [] };
		try {
			if (Array.isArray(ids)) {
				await dealerCarModel.updateMany(
					{ $or: [{ _id: { $in: ids } }] },
					{ isDeleted: true }
				);
			} else if (typeof ids === "string") {
				await dealerCarModel.updateOne(
					{ _id: Types.ObjectId(ids) },
					{ isDeleted: true }
				);
				response.id = ids;
			}
			response.status = true;
			response.id = ids;

			return response;
		} catch (error) {
			throw error;
		}
	}

	static async makeSold(data) {
		const response = { data: {}, status: false };
		try {
			const docData = await dealerCarModel.findOne({ _id: data._id, dealerId: data.dealerId });
			docData.status = "Sold";

			await docData?.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async makeRemoved(data) {
		const response = { data: {}, status: false };
		try {
			const docData = await dealerCarModel.findOne({ _id: data._id, dealerId: data.dealerId });
			docData.status = "Removed";

			await docData?.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async makeInList(data) {
		const response = { data: {}, status: false };
		try {
			const docData = await dealerCarModel.findOne({ _id: data._id, dealerId: data.dealerId });
			docData.status = "In List";
			await docData?.save();

			// Removing previous market place listing:  
			const prevMarketPlaceEntry = await marketPlaceLiveModel.findOne({
				dealerCarId: docData?._id,
				$or: [
					{ endTime: { $exists: false } },
					{ endTime: { $gte: new Date() } }
				]
			}).sort({ 'createdAt': -1 });

			if (prevMarketPlaceEntry?._id) {
				prevMarketPlaceEntry.endTime = new Date();
				await prevMarketPlaceEntry.save();
			}

			// Addding All new lisitng after removing previous one:
			const marketPlaceDoc = new marketPlaceLiveModel();
			marketPlaceDoc.dealerCarId = docData._id;
			marketPlaceDoc.startTime = new Date();
			await marketPlaceDoc.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async list(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				_id: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : "",
				status: query.status ? Array.isArray(query.status) ? { $in: query.status } : query.status : "",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
				isDeleted: false
			};

			clearSearch(search);

			const $aggregate = [
				{ $match: search },
				{
					$lookup: {
						from: "dealers",
						localField: "dealerId",
						foreignField: "_id",
						as: "dealerDetails",
						pipeline: [
							{
								$lookup: {
									from: "states",
									localField: "stateId",
									foreignField: "_id",
									as: "stateDetails",
									pipeline: [
										{
											$project: {
												name: 1,
											}
										}
									]
								}
							},
							{ $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: true } },
							{
								$project: {
									name: 1,
									avatar: 1,
									location: "$stateDetails.name"
								}
							}
						]
					}
				},
				{ $unwind: { path: "$dealerDetails" } },
				{
					$lookup: {
						from: 'brands',
						localField: 'brandId',
						foreignField: '_id',
						as: 'brandDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$brandDetail', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'brand_models',
						localField: 'modelId',
						foreignField: '_id',
						as: 'modelDetails',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'model_variants',
						localField: 'variantId',
						foreignField: '_id',
						as: 'variantDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$variantDetail', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'fuel_types',
						localField: 'fuelTypeId',
						foreignField: '_id',
						as: 'fuelTypes',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{
					$lookup: {
						from: 'cities',
						localField: 'cityId',
						foreignField: '_id',
						as: 'cityDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$cityDetail', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'dealer_car_likes',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'likesDetails',
						pipeline: [
							{
								$group: {
									_id: "$dealerCarId",
									likesCount: { $sum: 1 },
								},
							}
						]
					}
				},
				{ $unwind: { path: "$likesDetails", preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'dealer_car_offers',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'ifDealerMadeOffered',
						pipeline: [
							{
								$match: {
									dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
								}
							},
						]
					}
				},
				{
					$lookup: {
						from: 'dealer_car_likes',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'ifDealerLiked',
						pipeline: [
							{
								$match: {
									dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
								}
							},
						]
					}
				},
				{
					$lookup: {
						from: 'dealer_car_bookmarks',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'ifDealerBookmarked',
						pipeline: [
							{
								$match: {
									dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
								}
							},
						]
					}
				},
				{
					$lookup: {
						from: 'rtos',
						localField: 'rtoId',
						foreignField: '_id',
						as: 'rtoDetail',
						pipeline: [
							{
								$project: {
									name: 1,
									code: 1
								}
							}
						]
					}
				},
				{ $unwind: { path: '$rtoDetail', preserveNullAndEmptyArrays: false } },
				{
					$project: {
						rtoName: "$rtoDetail.name",
						rtoCode: "$rtoDetail.code",
						brandName: "$brandDetail.name",
						modelName: "$modelDetails.name",
						variantName: "$variantDetail.name",
						fuelTypes: "$fuelTypes.name",
						cityName: "$cityDetail.name",
						kmsDriven: 1,
						registrationNumber: {
							$concat: [
								{
									$substr: [
										{ $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
										0,
										5
									]
								},
								"XXXX"
							],
						},
						ownershipType: 1,
						askingPrice: 1,
						information: 1,
						thumbnailImage: 1,
						exteriorImageVideos: 1,
						interiorImageVideos: 1,
						likeCount: {
							$cond: ["$likesDetails", "$likesDetails.likesCount", 0]
						},
						liked: {
							$cond: [{ $size: "$ifDealerLiked" }, true, false]
						},
						bookmarked: {
							$cond: [{ $size: "$ifDealerBookmarked" }, true, false]
						},
						isOwner: {
							$cond: [
								{ $eq: ["$dealerId", query.requestingDealerId] },
								true,
								false
							]
						},
						madeOffers: {
							$cond: [{ $size: "$ifDealerMadeOffered" }, true, false]
						},
						status: 1,
						dealerDetails: 1,
						manufacturingYear: 1
					}
				},
				{
					$project: {
						rtoName: 1,
						rtoCode: 1,
						dealerCarId: "$_id",
						brandName: "$brandName",
						modelName: "$modelName",
						variantName: "$variantName",
						fuelTypes: "$fuelTypes",
						cityName: "$cityName",
						kmsDriven: "$kmsDriven",
						registrationNumber: "$registrationNumber",
						ownershipType: "$ownershipType",
						askingPrice: "$askingPrice",
						information: "$information",
						thumbnailImage: "$thumbnailImage",
						exteriorImageVideos: "$exteriorImageVideos",
						interiorImageVideos: "$interiorImageVideos",
						likeCount: "$likeCount",
						liked: "$liked",
						bookmarked: "$bookmarked",
						isOwner: "$isOwner",
						madeOffers: "$madeOffers",
						status: "$status",
						dealerDetails: "$dealerDetails",
						manufacturingYear: "$manufacturingYear"
					}
				}
			];
			response = await paginationAggregate(dealerCarModel, $aggregate, $extra);
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async count(query = {}) {
		let response = { data: {}, status: false };

		try {
			const dealerCarCount = (await dealerCarModel.aggregate([
				{ $match: { dealerId: Types.ObjectId(query.dealerId), isDeleted: false } },
				{
					$group: {
						_id: { dealerId: "$dealerId", status: "$status" },
						count: { $sum: 1 },
					},
				},
			]));

			response.data = dealerCarCount;

			response.status = true;

			return response;
		} catch (err) {
			throw err;
		}
	}

	static async listDistinctLocation(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				location: { $ne: null },
				isDeleted: false
			};

			const $aggregate = [
				{ $match: search },
				{
					$project: {
						location: 1,
					}
				},
				{
					$group: {
						_id: "$location",
					}
				},
				{
					$project: {
						_id: 0,
						status: "$_id",
					}
				},
				{
					$sort: { status: 1 }
				},
			];
			response = await paginationAggregate(dealerCarModel, $aggregate, $extra);
			response.data = response.data.map(v => v.status);
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = dealerCarModelServices;
