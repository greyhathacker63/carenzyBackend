const { Types } = require('mongoose');
const surveyQuesModel = require('../models/surveyQuestion');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');

class surveyQuesService {

    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await surveyQuesModel.findOne({
                _id
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
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        title: 1,
                        dataType: 1
                    }
                },
            ];
            response = await paginationAggregate(surveyQuesModel, $aggregate, $extra);
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
            const docData = _id ? await surveyQuesModel.findById(_id) : new surveyQuesModel();

            docData.title = data.title;
            docData.dataType = data.dataType;
            docData.status = data.status;
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
                await surveyQuesModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await surveyQuesModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = surveyQuesService;