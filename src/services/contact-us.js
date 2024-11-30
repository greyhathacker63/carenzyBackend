const { Types } = require("mongoose");
const contactUsModel = require("../models/contact-us");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class contactUsServices {

    static async details(query) {
        const search = {
            _id: query._id ? Types.ObjectId(query._id) : '',
            type: query.type ? query.type : ''
        };

        clearSearch(search);

        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await contactUsModel.findOne({ ...search });
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
                type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : ''
                // title: { '$regex': new RegExp(query.key || ''), $options: 'i' },
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        type: 1,
                        value: 1,
                    }
                },
            ];
            response = await paginationAggregate(contactUsModel, $aggregate, $extra);
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
            const docData = _id ? await contactUsModel.findById(_id) : new contactUsModel();

            docData.type = data.type;
            docData.value = data.value;
            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = contactUsServices