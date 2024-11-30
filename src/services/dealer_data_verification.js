const { Types } = require('mongoose');
const dealerDataVerifyModel = require('../models/dealer_data_verification');
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

module.exports = class Application {

	static async details(_id) {
		const response = { data: {}, status: false };
		try {
			response.data = await dealerDataVerifyModel.find({ _id })
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
				_id: query._id ? Types.ObjectId(query._id) : '',
				type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : '',
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : ''
			};

			clearSearch(search);

			let $aggregate = [
				{ $match: search },
				{ $sort: { _id: -1 } },
				{
					$project: {
						type: 1,
						approvalStatus: 1,
						message: 1,
						dealerId: 1
					}
				},
			];

			response = await paginationAggregate(dealerDataVerifyModel, $aggregate, $extra);
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
	static async save(data) {
		const response = { data: {}, status: false };

		try {
			const docData = new dealerDataVerifyModel();
			docData.dealerId = data.dealerId;
			docData.type = data.type;
			docData.approvalStatus = data.approvalStatus;
			docData.message = data.message ? data.message : "";
			await docData.save();
			response.data = docData;
			response.status = true;

			return response;
		} catch (err) {
			throw err;
		}
	}
	static async checkVerified(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };
		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : '',
				type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : '',
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : ''
			};

			clearSearch(search);

			let $aggregate = [
				{ $match: search },
				{
					$group: {
						_id: { dealerId: "$dealerId", type: "$type" },
						type: { $first: "$type" },
						approvalStatus: {$last: "$approvalStatus"}
					}
				}
			];

			response = await paginationAggregate(dealerDataVerifyModel, $aggregate, $extra);
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
}