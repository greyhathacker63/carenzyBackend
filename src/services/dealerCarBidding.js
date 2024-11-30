const { Types } = require("mongoose");
const dealerCarModel = require("../models/dealerCar");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

class dealerCarBiddingServices {
	static async list(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : "",
				// type: query.type ? query.type : "Bidding",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
				isDeleted: false,
			};

			clearSearch(search);

			const $aggregate = [
				{ $match: search },
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
						as: 'liveBiddingDetails',
						pipeline: [
							{
								$project: {
									lastBid: 1,
									startTime: 1,
									endTime: 1
								}
							}
						]

					}
				},
				{
					$lookup: {
						from: 'bidding_car_likes',
						localField: '_id',
						foreignField: 'dealerCarId',
						as: 'likeCount',
					}
				},
				{
					$project: {
						colorName: "$colorDetail.name",
						brandName: "$brandDetail.name",
						variantName: "$variantDetail.name",
						liveBiddingDetails: 1,
						fuelTypes: "$fuelTypes.name",
						kmsDriven: 1,
						registrationNumber: 1,
						numberOfOwners: 1,
						askingPrice: 1,
						information: 1,
						transmissionType: 1,
						thumbnailImage: 1,
						exteriorImageVideos: 1,
						interiorImageVideos: 1,
						likeCount: { $size: { $ifNull: ['$likeCount', []] } },

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
}

module.exports = dealerCarBiddingServices;
