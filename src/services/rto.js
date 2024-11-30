const { Types } = require("mongoose");
const RTOModel = require("../models/rto");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class RTO_services {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                name: { '$regex': new RegExp(query.key || ''), $options: 'i' },
                stateId: query.stateId ? Array.isArray(query.stateId) ? { $in: query.stateId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.stateId) : '',
                code: query.code ? query.code : "",
                status: query.forFront ? true : "",
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        stateId: 1,
                        name: 1,
                        code: 1,
                    }
                },
            ];

            response = await paginationAggregate(RTOModel, $aggregate, $extra);
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
            const docData = _id ? await RTOModel.findById(_id) : new RTOModel();

            docData.stateId = data.stateId;
            docData.name = data.name;
            docData.code = data.code;
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
                await RTOModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await RTOModel.updateOne({ _id: ids }, { isDeleted: true });
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
                $or: query.key ? [
                    { name: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                    { code: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                ] : "",
                stateId: query.stateId ? Array.isArray(query.stateId) ? { $in: query.stateId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.stateId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                {
                    $lookup: {
                        from: "states",
                        localField: "stateId",
                        foreignField: "_id",
                        as: "stateDetails",
                        pipeline: [
                            { $match: { isDeleted: false } },
                        ]
                    }
                },
                { $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: false } },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1,
                        code: 1,
                    }
                },
            ];

            response = await paginationAggregate(RTOModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
}

module.exports = RTO_services;