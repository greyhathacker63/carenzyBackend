const { Types } = require('mongoose');
const stateModel = require('../models/state');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');

class MasterService {

    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await stateModel.findOne({
                $or: [
                    { _id }
                ]
            });
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
                _id: query._id ? Array.isArray(query._id) ? query._id?.map(v => Types.ObjectId(v)) : Types.ObjectId(query._id) : '',
                $or: query.key ? [
                    {
                        name: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        code: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                ] : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
            ];

            if (query.withCity) {
                $aggregate.push({
                    $lookup: {
                        from: 'cities',
                        localField: '_id',
                        foreignField: 'stateId',
                        as: 'cityDetails',
                        pipeline: [
                            {
                                $project: {
                                    name: '$name',
                                }
                            }
                        ]
                    }
                },)
            }

            $aggregate.push({
                $project: {
                    name: 1,
                    code: 1,
                    cityDetails: 1
                }
            })
            response = await paginationAggregate(stateModel, $aggregate, $extra);
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
            const docData = _id ? await stateModel.findById(_id) : new stateModel();

            docData.name = data.name;
            docData.code = data.code;
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
                await stateModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await stateModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = MasterService;