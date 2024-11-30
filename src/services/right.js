const { Types } = require('mongoose');
const rightModel = require('../models/right');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');

class MasterService {

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
                ] : ''
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'right-groups',
                        localField: 'rightGrpId',
                        foreignField: '_id',
                        as: 'rightGrpDetail',
                        pipeline: [
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ]

                    }
                },
                {
                    $project: {
                        name: 1,
                        rightGrpName: '$rightGrpDetail.name',
                        code: 1,
                        rightGrpId: 1
                    }
                },
            ];
            response = await paginationAggregate(rightModel, $aggregate, $extra);
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
            const docData = _id ? await rightModel.findById(_id) : new rightModel();

            docData.name = data.name;
            docData.rightGrpId = data.rightGrpId;
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
                await rightModel.deleteMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === 'string') {
                await rightModel.deleteOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }

            response.status = true;
            response.ids = ids;

            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = MasterService;