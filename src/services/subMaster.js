const { Types } = require("mongoose");
const subMasterModel = require("../models/subMaster");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class subMasterServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                masterId: query.masterId ? Array.isArray(query.masterId) ? { $in: query.masterId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.masterId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        masterId: 1,
                        dataType: 1,
                        name: 1
                    }
                },
            ];

            response = await paginationAggregate(subMasterModel, $aggregate, $extra);
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
            const docData = _id ? await subMasterModel.findById(_id) : new subMasterModel();

            docData.masterId = data.masterId;
            docData.dataType = data.dataType;
            docData.name = data.name;

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
                await subMasterModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })
            } else if (typeof ids === "string") {
                await subMasterModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = subMasterServices;