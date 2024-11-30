const { Types } = require("mongoose");
const colorModel = require("../models/color");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class colorServices {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await colorModel.findOne({
                _id,
            })
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                brandId: query.brandId ? Types.ObjectId(query.brandId) : '',
                status: query.forFront ? true : "",
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        brandId: 1,
                        brandModelId: 1,
                        name: 1,
                        hexCode: 1,
                    }
                },
            ];

            response = await paginationAggregate(colorModel, $aggregate, $extra);
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
                _id: (query._id && query._id !== "NA") ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                brandId: (query.brandId && query.brandId !== "NA") ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                isDeleted: false
            };

            clearSearch(search);
            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1,
                        hexCode: 1,
                    }
                },
            ];

            response = await paginationAggregate(colorModel, $aggregate, $extra);
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
            const docData = _id ? await colorModel.findById(_id) : new colorModel();

            docData.brandId = data.brandId;
            docData.brandModelId = data.brandModelId;
            docData.name = data.name;
            docData.hexCode = data.hexCode;
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
                await colorModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await colorModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = colorServices;