const { Types } = require('mongoose');
const rightGrpModel = require('../models/rightsGroup');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');

class roleGrpService {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? query._id?.map(v => Types.ObjectId(v)) : Types.ObjectId(query._id) : '',
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
                    }
                },
            ];
            response = await paginationAggregate(rightGrpModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async listWithRights(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? query._id?.map(v => Types.ObjectId(v)) : Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                      from: "rights",
                      localField: "_id",
                      foreignField: "rightGrpId",
                      as: "rightData"
                    }
                  },
                  {
                    $unwind: "$rightData"
                  },
                  {
                    $group: {
                      _id: "$_id",
                      rightGrp: { $first: "$name" },
                      rights: { $push: {
                        name: "$rightData.name",
                        code: "$rightData.code"
                      } }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      rightGrp: 1,
                      rights: 1
                    }
                  }
            ];
            response = await paginationAggregate(rightGrpModel, $aggregate, $extra);
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
            const docData = _id ? await rightGrpModel.findById(_id) : new rightGrpModel();

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
                await rightGrpModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === 'string') {
                await rightGrpModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = roleGrpService;