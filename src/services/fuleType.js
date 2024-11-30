const { Types } = require("mongoose");
const fuleTypeModel = require("../models/fuleType");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class fuleTypeVariantServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : "",
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
            ];
            response = await paginationAggregate(fuleTypeModel, $aggregate, $extra);
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
            const docData = _id ? await fuleTypeModel.findById(_id) : new fuleTypeModel();
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
                await fuleTypeModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await fuleTypeModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }


    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1
                    }
                }
            ];
            response = await paginationAggregate(fuleTypeModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = fuleTypeVariantServices;