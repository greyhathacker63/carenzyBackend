const { Types } = require('mongoose');
const configurationModel = require('../models/configuration');
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class Configuration {
	static async details(query = {}) {
		let response = { data: null, status: false };
		try {
			const search = {
				_id: query._id ? Types.ObjectId(query._id) : '',
				type: query.type ? query.type : '',
				isDeleted: false
			};
			clearSearch(search);


			response.data = await configurationModel.findOne(search);
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
						type: 1,
						value: 1
					}
				},
			];

			response = await paginationAggregate(configurationModel, $aggregate, $extra);
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
			const docData = _id ? await configurationModel.findById(_id) : new configurationModel();
			docData.type = data.type;
			docData.value = data.value;
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
				await configurationModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })
			}
			else if (typeof ids === "string") {
				await configurationModel.updateOne({ _id: ids }, { isDeleted: true });
				response.id = ids
			}
			response.status = true;
			response.id = ids

			return response;
		} catch (error) {
			throw error;
		}

	}
	static async updateMarketCarCount() {
		const response = { data: {}, status: false };

		try {
			const docData = await configurationModel.findOne({ type: 'Market Car Count' }) || new configurationModel();
			docData.type = 'Market Car Count';
			docData.value = (await require('./dealerCarMarketPlace').list({ onlyTotal: 1 })).extra.total * 1 || 0;
			await docData.save();

			response.data = docData;
			response.status = true;

			return response;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = Configuration;