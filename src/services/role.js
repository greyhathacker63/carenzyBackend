const { Types } = require('mongoose');
const roleModel = require('../models/role');
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
                        rightCodes: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                ] : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'rights',
                        localField: 'rightCodes',
                        foreignField: 'code',
                        as: 'rightCodeTitles',
                        pipeline: [
                            {
                                $project: {
                                    name: '$name'
                                }
                            }
                        ]

                    }
                },

                {
                    $project: {
                        name: 1,
                        rightCodes: 1,
                        roleGrpId: 1,
                        rightCodeTitles: "$rightCodeTitles.name"
                    }
                },
            ];
            response = await paginationAggregate(roleModel, $aggregate, $extra);
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
            const docData = _id ? await roleModel.findById(_id) : new roleModel();

            docData.name = data.name;
            docData.rightCodes = data.rightCodes;
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
                await roleModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === 'string') {
                await roleModel.updateOne({ _id: ids }, { isDeleted: true });
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