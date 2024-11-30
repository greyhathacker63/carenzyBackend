const { Types } = require('mongoose');
const metadataModel = require('../models/metadata');
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class Metadata {
	static async list(query = {}) {
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
					$project: {
						name: 1,
						type: 1
					}
				},
			];

			response = await paginationAggregate(metadataModel, $aggregate, $extra);
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
			const docData = _id ? await metadataModel.findById(_id) : new metadataModel();
			docData.name = data.name;
			docData.type = data.type;
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
				await metadataModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })
			}
			else if (typeof ids === "string") {
				await metadataModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = Metadata;