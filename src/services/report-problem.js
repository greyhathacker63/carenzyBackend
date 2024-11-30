const { Types } = require('mongoose');
const reportProblemModel = require('../models/report-problem');
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

module.exports = class Application {

	static async details(_id) {

		const response = { data: {}, status: false };
		try {
			response.data = await reportProblemModel.findOne({ _id, isDeleted: false });
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
	static async listFront(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };
		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : '',
				dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : '',
				isDeleted: false
			};

			clearSearch(search);

			let $aggregate = [
				{ $match: search },
				{ $sort: { _id: -1 } },
				{
					$lookup: {
						from: "metadatas",
						localField: "metadataId",
						foreignField: "_id",
						as: "metadataDetails",
						pipeline: [
							{
								$project: {
									name: "$name",
								},
							},
						],
					},
				},
				{ $unwind: { path: "$metadataDetails", preserveNullAndEmptyArrays: false } },
				{
					$project: {
						reportId: 1,
						message: 1,
						metadataId: 1,
						metadataName: "$metadataDetails.name"
					}
				},
			];

			response = await paginationAggregate(reportProblemModel, $aggregate, $extra);
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
				type: query.type ? query.type : '',
				isDeleted: false
			};

			clearSearch(search);

			let $aggregate = [
				{ $match: search },
				{ $sort: { _id: -1 } },
				{
					$lookup: {
						from: "metadatas",
						localField: "metadataId",
						foreignField: "_id",
						as: "metadataDetails",
						pipeline: [
							{
								$project: {
									name: "$name",
								},
							},
						],
					},
				},
				{ $unwind: { path: "$metadataDetails", preserveNullAndEmptyArrays: false } },
				{
					$lookup: {
						from: "dealers",
						localField: "dealerId",
						foreignField: "_id",
						as: "dealerName",
						pipeline: [
							{
								$project: {
									name: "$name",
								},
							},
						],
					},
				},
				{ $unwind: { path: "$dealerName", preserveNullAndEmptyArrays: true } },
				{
					$project: {
						reportId: 1,
						message: 1,
						type: 1,
						dealerName: 1,
						type:"$metadataDetails.name"
					}
				},
			];

			response = await paginationAggregate(reportProblemModel, $aggregate, $extra);
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
	static async save(data) {
		const _id = data._id;
		const response = { data: {}, status: false };

		try {
			const docData = _id ? await reportProblemModel.findById(_id) : new reportProblemModel();
			docData.dealerId = data.dealerId;
			docData.message = data.message;
			docData.metadataId = data.metadataId;
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
				await reportProblemModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

			}
			else if (typeof ids === "string") {
				await reportProblemModel.updateOne({ _id: ids }, { isDeleted: true });
				response.id = ids
			}
			response.status = true;
			response.id = ids

			return response;
		} catch (error) {
			throw error;
		}

	}
}