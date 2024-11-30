const { Types } = require("mongoose");
const ratingDealerModel = require("../models/ratingDealer");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

class ratingDealerServices {
	static async avg(toDealerId) {
		const response = { data: {}, status: false };
		try {
			response.data = (await ratingDealerModel.aggregate([
				{ $match: { toDealerId: Types.ObjectId(toDealerId), isDeleted: false } },
				{
					$group: {
						_id: "$toDealerId",
						count: { $sum: 1 },
						sum: { $sum: "$rating" }
					}
				},
				{
					$project: {
						_id: 0,
						count: "$count",
						sum: "$sum",
						avg: { $round: [{ $divide: ["$sum", "$count"] }, 2] },
					}
				}
			]))?.[0];
			response.status = true;
			return response;
		} catch (error) {
			console.log("eee", error)
			throw error;
		}
	}

	static async list(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				fromDealerId: query.fromDealerId ? Types.ObjectId(query.fromDealerId) : "",
				toDealerId: query.toDealerId ? Types.ObjectId(query.toDealerId) : "",
				isDeleted: false,
			};

			clearSearch(search);

			const $aggregate = [
				{ $match: search },
				{
					$lookup: {
						from: "dealers",
						localField: "fromDealerId",
						foreignField: "_id",
						as: "dealerDetail",
						pipeline: [
							{
								$project: {
									name: "$dealershipName",
									avatar: 1,
									location: 1
								}
							}
						]
					}
				},
				{ $unwind: { path: "$dealerDetail" } },
				{
					$project: {
						_id: 0,
						rating: 1,
						review: 1,
						dealerName: { $cond: ["$dealerDetail.name", "$dealerDetail.name", null] },
						dealerAvatar: { $cond: ["$dealerDetail.avatar", "$dealerDetail.avatar", null] },
						dealerLocation: { $cond: ["$dealerDetail.location", "$dealerDetail.location", null] },
						yourRating: { $eq: [query.cuserId.toString(), { $toString: "$fromDealerId" }] }
					}
				},
				{ $sort: { yourRating: -1, _id: -1 } }
			];
			response = await paginationAggregate(ratingDealerModel, $aggregate, $extra);

			response.data = response.data?.map(v => ({ ...v.dealerDetail, ...v, }));

			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async save(data) {
		const response = { data: {}, status: false };
		try {
			const docData = await ratingDealerModel.findOne({ fromDealerId: Types.ObjectId(data.fromDealerId), toDealerId: Types.ObjectId(data.toDealerId), isDeleted: false }) || new ratingDealerModel();

			docData.fromDealerId = data.fromDealerId;
			docData.toDealerId = data.toDealerId;
			docData.rating = data.rating || docData.rating;
			docData.review = data.review;
			await docData.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	static async delete(data) {
		const response = { status: false, ids: [] };
		try {
			await ratingDealerModel.updateOne(
				{
					fromDealerId: data.fromDealerId,
					toDealerId: data.toDealerId,
					isDeleted: false,
				},
				{ isDeleted: true }
			);
			response.status = true;

			return response;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = ratingDealerServices;
