const { Types } = require("mongoose");
const masterModel = require("../models/master");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class masterServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1,
                        status: 1,
                    }
                },
            ];

            response = await paginationAggregate(masterModel, $aggregate, $extra);
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
            const docData = _id ? await masterModel.findById(_id) : new masterModel();

            docData.name = data.name;
            docData.status = data.status ?? docData.status;

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
                await masterModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await masterModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = masterServices;