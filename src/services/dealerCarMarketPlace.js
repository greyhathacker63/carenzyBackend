const { Types } = require("mongoose");
const dealerCarModel = require("../models/dealerCar");
const marketPlaceLiveModel = require("../models/marketPlaceLive");
const brandModel = require("../models/brand");
const brandModelModel = require("../models/brandModel");
const modelVariantModel = require("../models/modelVariant");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch, getDateWithoutTime } = require("../utilities/Helper");

class dealerCarMarketPlaceServices {
	static async detailsAdmin(query = {}) {
		const response = { data: {}, status: false };
		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : "",
				// type: query.type ? query.type : "Market",
				isDeleted: false,
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
						from: 'states',
						localField: 'stateId',
						foreignField: '_id',
						as: 'stateDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$stateDetail', preserveNullAndEmptyArrays: true } },
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
						from: 'rtos',
						localField: 'rtoId',
						foreignField: '_id',
						as: 'rtoDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$rtoDetail', preserveNullAndEmptyArrays: false } },
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
						from: 'dealer_car_likes',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'ifDealerLiked',
						pipeline: [
							{
								$match: {
									dealerId: query?.dealerId ? Types.ObjectId(query?.dealerId) : ''
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
									dealerId: query?.dealerId ? Types.ObjectId(query?.dealerId) : ''
								}
							},
						]
					}
				},
				{
					$lookup: {
						from: 'colors',
						localField: 'colorId',
						foreignField: '_id',
						as: 'colorDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$colorDetail', preserveNullAndEmptyArrays: true } },
				{
					$project: {
						brandName: "$brandDetail.name",
						modelName: "$modelDetails.name",
						variantName: "$variantDetail.name",
						fuelTypes: "$fuelTypes.name",
						stateName: "$stateDetail.name",
						cityName: "$cityDetail.name",
						rtoName: "$rtoDetail.name",
						colorName: "$colorDetail.name",
						kmsDriven: 1,
						registrationNumberMasked: {
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
						registrationNumber: { $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
						ownershipType: 1,
						askingPrice: 1,
						information: 1,
						thumbnailImage: 1,
						exteriorImageVideos: 1,
						interiorImageVideos: 1,
						engineImageVideos: 1,
						numberOfOwners: 1,
						kmsDriven: 1,
						transmissionType: 1,
						insuranceType: 1,
						bonusNotClaimed: 1,
						bonusNotClaimedPercentage: 1,
						underHypothecation: 1,
						keys: 1,
						manufacturingYear: 1,
						manufacturingMonth: 1,
						registrationYear: 1,
						registrationMonth: 1,
						insuranceExpiryMonth: 1,
						insuranceExpiryYear: 1,
						ownershipType: 1,
						rcAvailibity: 1,
						rcImages: 1,
						chassisNumber: 1,
						chassisImages: 1,
						chassisNumberEmbossing: 1,
						insuranceImages: 1,
						additionalPhotos: 1,
						additionInformation: 1,
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
								{ $eq: ["$dealerId", query.dealerId] },
								true,
								false
							]
						},
						dealerDetails: 1
					}
				}
			];
			response.data = (await dealerCarModel.aggregate($aggregate))?.[0];
			response.status = true;
			return response;
		} catch (error) {
			throw error;
		}
	}
	static async listAdmin(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : "",
				// type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : "Market",
				status: query.status ? Array.isArray(query.status) ? { $in: query.status } : query.status : "",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
				isDeleted: false
			};

			clearSearch(search);
			const $aggregate = [
				{ $match: search },
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
					$project: {
						brandName: "$brandDetail.name",
						modelName: "$modelDetails.name",
						variantName: "$variantDetail.name",
						fuelTypes: "$fuelTypes.name",
						cityName: "$cityDetail.name",
						kmsDriven: 1,
						registrationNumber: 1,
						ownershipType: 1,
						askingPrice: 1,
						information: 1,
						thumbnailImage: 1,
						exteriorImageVideos: 1,
						interiorImageVideos: 1,
						likeCount: {
							$cond: ["$likesDetails", "$likesDetails.likesCount", 0]
						},
						status: 1,
						manufacturingYear: 1
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
	static async detailsByMarketPlaceLiveId(_id) {
		const response = { data: {}, status: false };
		try {
			response.data = await marketPlaceLiveModel.findById(_id);
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
			const docData = _id ? await marketPlaceLiveModel.findById(_id) : new marketPlaceLiveModel();

			docData.dealerCarId = data.dealerCarId;
			docData.startTime = data.startTime;
			// docData.endTime = data.endTime;

			await docData.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
	static async details(query = {}) {
		const response = { data: {}, status: false };
		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : "",
				// type: query.type ? query.type : "Market",
				isDeleted: false,
			};

			clearSearch(search);

			const searchBiddings = {
				liveBiddingId: query.liveBiddingId ? Types.ObjectId(query.liveBiddingId) : "",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
				isDeleted: false
			}

			clearSearch(searchBiddings);

			const searchOffers = {
				marketPlaceLiveId: query.marketPlaceLiveId ? Types.ObjectId(query.marketPlaceLiveId) : "",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
			}

			clearSearch(searchOffers);

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
								$lookup: {
									from: "rtos",
									localField: "rtoId",
									foreignField: "_id",
									as: "rtoDetails",
									pipeline: [
										{
											$project: {
												name: 1,
											}
										}
									]
								}
							},
							{ $unwind: { path: "$rtoDetails", preserveNullAndEmptyArrays: true } },
							{
								$project: {
									name: { $cond: ["$dealershipName", "$dealershipName", "Carenzy Dealer"] },
									avatar: { $cond: ["$avatar", "$avatar", "https://admin.carenzy.com/favicon.svg"] },
									location: { $cond: ["$location", "$location", null] },
									phone: { $first: "$phones" }
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
						from: 'dealer_car_likes',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'ifDealerLiked',
						pipeline: [
							{
								$match: {
									dealerId: query?.dealerId ? Types.ObjectId(query?.dealerId) : ''
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
									dealerId: query?.dealerId ? Types.ObjectId(query?.dealerId) : ''
								}
							},
						]
					}
				},
				{
					$lookup: {
						from: 'colors',
						localField: 'colorId',
						foreignField: '_id',
						as: 'colorDetail',
						pipeline: [
							{
								$project: {
									name: '$name',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$colorDetail', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'bidding_lives',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'biddingLivesDetails',
						pipeline: [
							{
								$project: {
									endTime: '$endTime',
								}
							}
						]
					}
				},
				{ $unwind: { path: '$biddingLivesDetails', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'biddings',
						as: 'biddingList',
						pipeline: [
							{ $match: searchBiddings },
							{ $sort: { _id: -1 } },
							{ $limit: 1 },
							{
								$project: {
									bidAmount: '$bidAmount',
								}
							}
						]
					},
					hidden: query.type === "Market"
				},
				{ $unwind: { path: '$biddingList', preserveNullAndEmptyArrays: true }, hidden: query.type === "Market" },
				{
					$lookup: {
						from: 'dealer_car_offers',
						as: 'offerList',
						pipeline: [
							{ $match: searchOffers },
							{ $sort: { _id: -1 } },
							{ $limit: 1 },
							{
								$project: {
									offerAmount: '$amount',
								}
							}
						]
					},
					hidden: query.type === "Bidding"
				},
				{ $unwind: { path: '$offerList', preserveNullAndEmptyArrays: true }, hidden: query.type === "Bidding" },
				{
					$project: {
						brandName: "$brandDetail.name",
						modelName: "$modelDetails.name",
						variantName: "$variantDetail.name",
						fuelTypes: "$fuelTypes.name",
						rtoName: { $trim: { input: "$rtoDetail.name" } },
						rtoCode: "$rtoDetail.code",
						colorName: "$colorDetail.name",
						endTime: "$biddingLivesDetails.endTime",
						kmsDriven: 1,
						registrationNumberMasked: {
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
						registrationNumber: { $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
						ownershipType: 1,
						askingPrice: 1,
						information: 1,
						thumbnailImage: 1,
						exteriorImageVideos: 1,
						interiorImageVideos: 1,
						engineImageVideos: 1,
						numberOfOwners: 1,
						kmsDriven: 1,
						paintedPiecesCount: 1,
						transmissionType: { $cond: ["$transmissionType", "$transmissionType", null] },
						insuranceType: 1,
						bonusNotClaimed: 1,
						bonusNotClaimedPercentage: 1,
						underHypothecation: 1,
						keys: 1,
						manufacturingYear: 1,
						manufacturingMonth: 1,
						registrationYear: 1,
						registrationMonth: 1,
						insuranceExpiryMonth: 1,
						insuranceExpiryYear: 1,
						ownershipType: 1,
						rcAvailibity: 1,
						rcImages: 1,
						chassisNumber: 1,
						chassisImages: 1,
						chassisNumberEmbossing: 1,
						insuranceImages: 1,
						additionalPhotos: 1,
						additionInformation: 1,
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
								{ $eq: ["$dealerId", query.dealerId] },
								true,
								false
							]
						},
						dealerDetails: 1,
						lastBid: { $cond: ["$biddingList.bidAmount", "$biddingList.bidAmount", 0] },
						lastOffer: { $cond: ["$offerList.offerAmount", "$offerList.offerAmount", 0] },
						status: 1,
						location: { $cond: ["$location", "$location", null] },
						reportAlreadyPainted: { $cond: ["$reportAlreadyPainted", "$reportAlreadyPainted", null] },
						reportPaintingRequired: { $cond: ["$reportPaintingRequired", "$reportPaintingRequired", null] },
						reportPieceChange: { $cond: ["$reportPieceChange", "$reportPieceChange", null] },
						reportStearing: { $cond: ["$reportStearing", "$reportStearing", null] },
						reportSuspension: { $cond: ["$reportSuspension", "$reportSuspension", null] },
						reportEngine: { $cond: ["$reportEngine", "$reportEngine", null] },
						reportAC: { $cond: ["$reportAC", "$reportAC", null] },
						reportRusting: { $cond: ["$reportRusting", "$reportRusting", null] },
						reportTyres: { $cond: ["$reportTyres", "$reportTyres", null] },
						reportSunroof: { $cond: ["$reportSunroof", "$reportSunroof", null] },
						reportInterior: { $cond: ["$reportInterior", "$reportInterior", null] },
						reportRefurb: { $cond: ["$reportRefurb", "$reportRefurb", null] },
						reportDescription: { $cond: ["$reportDescription", "$reportDescription", null] },
					}
				}
			].filter(v => !v.hidden).map(v => { delete v.hidden; return v; });
			response.data = (await dealerCarModel.aggregate($aggregate))?.[0];
			response.status = true;
			return response;
		} catch (error) {
			throw error;
		}
	}
	static async list(query = {}) {
		const $extra = { page: query.page, limit: query.limit, total: query.total || 10000, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : "",
				dealerCarId: (query.dealerCarId && query.dealerCarId != "NA") ? Types.ObjectId(query.dealerCarId) : "",
				startTime: { $lte: new Date() },
				endTime: { $exists: false },
				$or: query?.key?.trim() ? [
					{ brandName: { '$regex': new RegExp(query.key?.trim() || ''), $options: 'i' } },
					{ modelName: { '$regex': new RegExp(query.key?.trim() || ''), $options: 'i' } },
					{ variantName: { '$regex': new RegExp(query.key?.trim() || ''), $options: 'i' } },
					// query.rtoId && query.rtoId != "NA" ? { rtoId: Array.isArray(query.rtoId) ? { $in: query.rtoId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.rtoId) } : ''
				] : "",
				brandId: (query.brandId && query.brandId != "NA") ? Array.isArray(query.brandId) ? { $in: query.brandId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
				modelId: (query.modelId && query.modelId != "NA") ? Array.isArray(query.modelId) ? { $in: query.modelId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.modelId) : '',
				variantId: (query.variantId && query.variantId != "NA") ? Array.isArray(query.variantId) ? { $in: query.variantId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.variantId) : '',
				rtoId: (query.rtoId && query.rtoId.length && query.rtoId != "NA") ? Array.isArray(query.rtoId) ? { $in: query.rtoId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.rtoId) : '',
				fuelTypeId: (query.fuelTypeId && query.fuelTypeId != "NA") ? Array.isArray(query.fuelTypeId) ? { $in: query.fuelTypeId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.fuelTypeId) : '',
				transmissionType: (query.transmissionType && query.transmissionType != "NA") ? query.transmissionType : "",
				manufacturingYear: (query.manufacturingYear && query.manufacturingYear != "NA") ? query.manufacturingYear : "",
				registrationYear: (query.registrationYear && query.registrationYear != "NA") ? query.registrationYear : "",
				numberOfOwners: (query.numberOfOwners && query.numberOfOwners != "NA") ? query.numberOfOwners : "",
				location: query.location ? Array.isArray(query.location) ? { $in: query.location } : query.location : "",
				locationDealer: query.locationDealer ? Array.isArray(query.locationDealer) ? { $in: query.locationDealer } : query.locationDealer : "",
				dealerId: (query.dealerId && query.dealerId != "NA") ? Array.isArray(query.dealerId) ? { $in: query.dealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
			};
			if (query.keyWiseRtoId && query.keyWiseRtoId.length) {
				search.$or.push({ rtoId: Array.isArray(query.keyWiseRtoId) ? { $in: query.keyWiseRtoId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.keyWiseRtoId) })
			}
			if (query.keyWiseDealerId && query.keyWiseDealerId.length) {
				search.$or.push({ dealerId: Array.isArray(query.keyWiseDealerId) ? { $in: query.keyWiseDealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.keyWiseDealerId) })
			}
			const searchDealerCars = {
				// _id: (query.dealerCarId && query.dealerCarId != "NA") ? Types.ObjectId(query.dealerCarId) : "",
				// brandId: (query.brandId && query.brandId != "NA") ? Array.isArray(query.brandId) ? { $in: query.brandId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
				// modelId: (query.modelId && query.modelId != "NA") ? Array.isArray(query.modelId) ? { $in: query.modelId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.modelId) : '',
				// variantId: (query.variantId && query.variantId != "NA") ? Array.isArray(query.variantId) ? { $in: query.variantId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.variantId) : '',
				// rtoId: (query.rtoId && query.rtoId != "NA") ? Array.isArray(query.rtoId) ? { $in: query.rtoId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.rtoId) : '',
				// fuelTypeId: (query.fuelTypeId && query.fuelTypeId != "NA") ? Array.isArray(query.fuelTypeId) ? { $in: query.fuelTypeId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.fuelTypeId) : '',
				// transmissionType: (query.transmissionType && query.transmissionType != "NA") ? query.transmissionType : "",
				// manufacturingYear: (query.manufacturingYear && query.manufacturingYear != "NA") ? query.manufacturingYear : "",
				// registrationYear: (query.registrationYear && query.registrationYear != "NA") ? query.registrationYear : "",
				// numberOfOwners: (query.numberOfOwners && query.numberOfOwners != "NA") ? query.numberOfOwners : "",
				// type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : "Market",
				status: (query.status && query.status != "NA") ? Array.isArray(query.status) ? { $in: query.status } : query.status : "",
				// dealerId: (query.dealerId && query.dealerId != "NA") ? Array.isArray(query.dealerId) ? { $in: query.dealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
				isDeleted: false
			};

			const sort = { _id: -1 };

			if ((query.startPrice && query.endPrice) && (query.startPrice != "NA" && query.endPrice != "NA")) {
				searchDealerCars.askingPrice = {
					$lte: query.endPrice * 1,
					$gte: query.startPrice * 1
				}
			}
			if ((query.manufacturingYearStart && query.manufacturingYearEnd) && (query.manufacturingYearStart != "NA" && query.manufacturingYearEnd != "NA")) {
				searchDealerCars.manufacturingYear = {
					$gte: query.manufacturingYearStart,
					$lte: query.manufacturingYearEnd
				}
			}
			if ((query.kmsDrivenStart && query.kmsDrivenEnd) && (query.kmsDrivenStart != "NA" && query.kmsDrivenEnd != "NA")) {
				searchDealerCars.kmsDriven = {
					$gte: parseInt(query.kmsDrivenStart),
					$lte: parseInt(query.kmsDrivenEnd)
				}
			}

			if (query.sortManufacturingYear == "1" || query.sortManufacturingYear == "-1") {
				delete sort._id;
				sort["manufacturingYear"] = query.sortManufacturingYear * 1;
			} else if (query.sortAddedDate == "1" || query.sortAddedDate == "-1") {
				sort._id = query.sortAddedDate * 1;
			} else if (query.sortPrice == "1" || query.sortPrice == "-1") {
				delete sort._id;
				sort["askingPrice"] = query.sortPrice * 1;
			} else if (query.sortKilometerDriven == "1" || query.sortKilometerDriven == "-1") {
				delete sort._id;
				sort["kmsDriven"] = query.sortKilometerDriven * 1;
			}


			clearSearch(search);
			clearSearch(searchDealerCars);

			const $aggregate = [
				{ $sort: sort },
				{ $match: search },
				{
					$lookup: {
						from: 'dealer_car_offers',
						localField: '_id',
						foreignField: 'marketPlaceLiveId',
						as: 'ifDealerMadeOffered',
						pipeline: [
							{
								$match: {
									dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
								}
							},
						]
					},
					hidden: !query.myOffer
				},
				{ $unwind: { path: "$ifDealerMadeOffered", preserveNullAndEmptyArrays: false }, hidden: !query.myOffer },
				{
					$lookup: {
						from: 'dealer_cars',
						localField: 'dealerCarId',
						foreignField: '_id',
						as: 'marketCarDetails',
						pipeline: [
							{ $match: searchDealerCars },
							{
								$lookup: {
									from: "dealers",
									localField: "dealerId",
									foreignField: "_id",
									as: "dealerDetails",
									pipeline: [
										{
											$project: {
												name: { $cond: ["$dealershipName", "$dealershipName", "Carenzy Dealer"] },
												avatar: { $cond: ["$avatar", "$avatar", "https://admin.carenzy.com/favicon.svg"] },
												location: { $cond: ["$location", "$location", ""] },
												phone: { $first: "$phones" }
											}
										}
									]
								}
							},
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
							{ $unwind: { path: "$dealerDetails" } },

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
							{ $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: false } },
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
									rtoName: { $trim: { input: "$rtoDetail.name" } },
									rtoCode: "$rtoDetail.code",
									brandName: "$brandDetail.name",
									modelName: "$modelDetails.name",
									variantName: "$variantDetail.name",
									fuelTypes: "$fuelTypes.name",
									cityName: "$cityDetail.name",
									kmsDriven: 1,
									reportDescription: 1,
									paintedPiecesCount: 1,
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
									engineImageVideos: 1,
									insuranceDate: 1,
									isOwner: {
										$cond: [
											{ $eq: ["$dealerId", query.requestingDealerId] },
											true,
											false
										]
									},
									status: 1,
									dealerDetails: 1,
									numberOfOwners: 1,
									keys: 1,
									manufacturingYear: 1,
									underHypothecation: 1,
									collaboration: 1,
									manufacturingMonth: 1,
									insuranceExpiryMonth: 1,
									insuranceExpiryYear: 1,
									registrationMonth: 1,
									registrationYear: 1,
									insuranceType: 1,
									bonusNotClaimed: 1,
									bonusNotClaimedPercentage: 1,
									transmissionType: 1,
									rcAvailibity: 1,
									chassisNumber: 1,
									chassisNumberEmbossing: 1,
									location: { $cond: ["$location", "$location", null] },
								}
							}
						].filter(v => !v.hidden).map(v => { delete v.hidden; return v; })
					}
				},
				{ $unwind: { path: "$marketCarDetails", preserveNullAndEmptyArrays: false } },
				{
					$project: {
						startTime: 1,
						endTime: 1,
						rtoName: "$marketCarDetails.rtoName",
						reportDescription: "$marketCarDetails.reportDescription",
						insuranceDate: "$marketCarDetails.insuranceDate",
						rtoCode: "$marketCarDetails.rtoCode",
						dealerCarId: "$marketCarDetails._id",
						brandName: "$marketCarDetails.brandName",
						modelName: "$marketCarDetails.modelName",
						variantName: "$marketCarDetails.variantName",
						fuelTypes: "$marketCarDetails.fuelTypes",
						cityName: "$marketCarDetails.cityName",
						kmsDriven: "$marketCarDetails.kmsDriven",
						paintedPiecesCount: "$marketCarDetails.paintedPiecesCount",
						registrationNumber: "$marketCarDetails.registrationNumber",
						ownershipType: "$marketCarDetails.ownershipType",
						askingPrice: "$marketCarDetails.askingPrice",
						information: "$marketCarDetails.information",
						thumbnailImage: "$marketCarDetails.thumbnailImage",
						exteriorImageVideos: "$marketCarDetails.exteriorImageVideos",
						interiorImageVideos: "$marketCarDetails.interiorImageVideos",
						engineImageVideos: "$marketCarDetails.engineImageVideos",
						likeCount: "$marketCarDetails.likeCount",
						liked: "$marketCarDetails.liked",
						bookmarked: "$marketCarDetails.bookmarked",
						isOwner: "$marketCarDetails.isOwner",
						status: "$marketCarDetails.status",
						dealerDetails: "$marketCarDetails.dealerDetails",
						numberOfOwners: "$marketCarDetails.numberOfOwners",
						keys: "$marketCarDetails.keys",
						manufacturingYear: "$marketCarDetails.manufacturingYear",
						manufacturingMonth: "$marketCarDetails.manufacturingMonth",
						insuranceExpiryMonth: "$marketCarDetails.insuranceExpiryMonth",
						insuranceExpiryYear: "$marketCarDetails.insuranceExpiryYear",
						registrationMonth: "$marketCarDetails.registrationMonth",
						registrationYear: "$marketCarDetails.registrationYear",
						underHypothecation: "$marketCarDetails.underHypothecation",
						collaboration: "$marketCarDetails.collaboration",
						insuranceType: "$marketCarDetails.insuranceType",
						bonusNotClaimed: "$marketCarDetails.bonusNotClaimed",
						bonusNotClaimedPercentage: "$marketCarDetails.bonusNotClaimedPercentage",
						transmissionType: { $cond: ["$marketCarDetails.transmissionType", "$marketCarDetails.transmissionType", null] },
						rcAvailibity: "$marketCarDetails.rcAvailibity",
						chassisNumber: "$marketCarDetails.chassisNumber",
						chassisNumberEmbossing: "$marketCarDetails.chassisNumberEmbossing",
						liked: { $cond: [true, true, true] },
						bookmarked: { $cond: [true, true, true] },
						likeCount: { $cond: [true, 0, 0] },
						location: "$marketCarDetails.location",
					}
				},
			].filter(v => !v.hidden).map(v => { delete v.hidden; return v; });

			if (query.onlyTotal) {
				response.extra.page = 0;
				response.extra.limit = 0;
				response.extra.total = (await marketPlaceLiveModel.aggregate([...$aggregate, { $count: "total" }]))?.[0]?.total || 0;
			} else {
				response = await paginationAggregate(marketPlaceLiveModel, $aggregate, $extra);
			}
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async saveDealerCarKeys() {
		const response = { data: [], status: false };
		try {
			const marketCars = await marketPlaceLiveModel.find();

			const brands = await brandModel.find();
			const brandModels = await brandModelModel.find();
			const modelVariants = await modelVariantModel.find();

			for (let i = 0; i < marketCars.length; i++) {
				const carData = await dealerCarModel.findById(marketCars[i].dealerCarId);

				const brandName = brands.find(v => v._id.toString() === carData.brandId.toString())?.name;
				const modelName = brandModels.find(v => v._id.toString() === carData.modelId.toString())?.name;
				const variantName = modelVariants.find(v => v._id.toString() === carData.variantId.toString())?.name;

				const docData = await marketPlaceLiveModel.findById(marketCars[i]._id);
				docData.dealerId = carData.dealerId;
				docData.brandId = carData.brandId;
				docData.modelId = carData.modelId;
				docData.variantId = carData.variantId;
				docData.colorId = carData.colorId;
				docData.rtoId = carData.rtoId;
				docData.stateId = carData.stateId;
				docData.cityId = carData.cityId;
				docData.fuelTypeId = carData.fuelTypeId;
				docData.manufacturingMonth = carData.manufacturingMonth;
				docData.manufacturingYear = carData.manufacturingYear;
				docData.registrationMonth = carData.registrationMonth;
				docData.registrationYear = carData.registrationYear;
				docData.insuranceExpiryMonth = carData.insuranceExpiryMonth;
				docData.insuranceExpiryYear = carData.insuranceExpiryYear;
				docData.kmsDriven = carData.kmsDriven;
				docData.askingPrice = carData.askingPrice;
				docData.transmissionType = carData.transmissionType;
				docData.numberOfOwners = carData.numberOfOwners;
				docData.location = carData.location;
				docData.brandName = brandName;
				docData.modelName = modelName;
				docData.variantName = variantName;

				await docData.save();
			}

			response.data = marketCars;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = dealerCarMarketPlaceServices;
