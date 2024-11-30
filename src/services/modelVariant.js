const { Types } = require("mongoose");
const modelVariant = require("../models/modelVariant");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class modelVariantServices {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await modelVariant.findOne({
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
                status: query.forFront ? true : "",
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                brandId: query.brandId ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                brandModelId: query.modelId ? Array.isArray(query.modelId) ? { $in: query.modelId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.modelId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
            ];
            response = await paginationAggregate(modelVariant, $aggregate, $extra);
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
            const docData = _id ? await modelVariant.findById(_id) : new modelVariant();

            docData.brandId = data.brandId;
            docData.brandModelId = data.brandModelId;
            docData.fuelTypeId = data.fuelTypeId;
            docData.engineTypeId = data.engineTypeId;
            docData.name = data.name;
            docData.year = data.year;
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
                await modelVariant.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await modelVariant.updateOne({ _id: ids }, { isDeleted: true });
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
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                brandId: (query.brandId && query.brandId !== "NA") ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                brandModelId: (query.brandModelId && query.brandModelId !== "NA") ? Array.isArray(query.brandModelId) ? { $in: query.brandModelId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandModelId) : '',
                // status: true,
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1,
                        year: 1,
                        brandId: 1,
                        brandModelId: 1
                    }
                },
            ];
            response = await paginationAggregate(modelVariant, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = modelVariantServices;