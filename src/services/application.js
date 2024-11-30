const { Types } = require('mongoose');
const applicationModel = require('../models/application');
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

module.exports = class Application {

	static async details(query) {
		const search = {
			_id: query._id ? Types.ObjectId(query._id) : '',
			type: query.type ? query.type : ''
		};

		clearSearch(search);

		const response = { data: {}, status: false };
		try {
			response.data = (await applicationModel.findOne({ ...search }))?.toObject();
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
				type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : ''
			};

			clearSearch(search);

			let $aggregate = [
				{ $match: search },
				{ $sort: { _id: -1 } },
				{
					$project: {
						type: 1,
						data: 1,
					}
				},
			];

			response = await paginationAggregate(applicationModel, $aggregate, $extra);
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
			const docData = _id ? await applicationModel.findById(_id) : new applicationModel();
			docData.data = data.data;
			docData.type = data.type;

			await docData.save();

			response.data = docData;
			response.status = true;

			return response;
		} catch (err) {
			throw err;
		}
	}
}