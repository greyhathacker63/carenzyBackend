const { Types } = require("mongoose");
const dealerCarOfferModel = require("../models/dealerCarOffer");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

class dealerCarModelServices {
	static async details(query = {}) {
		const response = { data: {}, status: false };
		const search = {
			_id: query._id ? Types.ObjectId(query._id) : "",
		};

		clearSearch(search);
		try {
			_id = Types.ObjectId(_id);
			response.data = await dealerCarOfferModel.findOne(query);
			response.status = true;
			return response;
		} catch (error) {
			throw error;
		}
	}
	static async save(data) {
		const response = { data: {}, status: false };
		try {
			const docData = await dealerCarOfferModel.findOne({ 
				marketPlaceLiveId: Types.ObjectId(data.marketPlaceLiveId), 
				dealerId: Types.ObjectId(data.dealerId), 
				dealerCarId: Types.ObjectId(data.dealerCarId) 
			}) || new dealerCarOfferModel();

			docData.marketPlaceLiveId = data.marketPlaceLiveId;
			docData.dealerCarId = data.dealerCarId;
			docData.dealerId = data.dealerId;
			docData.amount = data.amount;
			await docData.save();

			response.data = docData;
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
	static async listAdmin(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				dealerCarId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : "",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
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
					$project: {
						dealerDetails: 1,
						amount: 1
					},
				},
			];
			response = await paginationAggregate(dealerCarOfferModel, $aggregate, $extra);

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
				marketPlaceLiveId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : "",
				// dealerCarId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : "",
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
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
									location: "$stateDetails.name",
									phone: { $first: "$phones" }
								}
							}
						]
					}
				},
				{ $unwind: { path: "$dealerDetails" } },
				{
					$project: {
						dealerDetails: 1,
						amount: 1
					},
				},
			];
			response = await paginationAggregate(dealerCarOfferModel, $aggregate, $extra);

			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = dealerCarModelServices;
