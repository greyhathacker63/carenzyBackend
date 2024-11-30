const { Types } = require("mongoose");
const dealerLoginModel = require("../models/dealerLogin");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class dealerLoginServices {

    static async details(_id) {
        let response = { data: {}, status: false };

        try {
            response.data = await dealerLoginModel.findById(_id);
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
                _id: query._id ? Types.ObjectId(query._id) : '',
                dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : '',
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        dealerId: 1,
                        phone: 1,
                        ip: 1,
                    }
                },
            ];

            response = await paginationAggregate(dealerLoginModel, $aggregate, $extra);
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
            const docData = _id ? await dealerLoginModel.findById(_id) : new dealerLoginModel();

            docData.dealerId = data.dealerId;
            docData.phone = data.phone;
            docData.ip = data.ip;
            docData.otp = data.otp;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async saveByKeys(data={}) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await dealerLoginModel.findById(_id) : new dealerLoginModel();

            Object.keys(data).map(v=> {
                docData[v] = data[v];
            });

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = dealerLoginServices;