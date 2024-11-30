const { Types } = require("mongoose");
const dealerFcmTokenModel = require("../models/dealerFcmToken");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class dealerFcmTokenServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll, total: query.total };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : '',
                isDeleted: false
            };
            clearSearch(search);

            const $aggregate = [
                { $match: search },
                {
                    $project: {
                        dealerId: 1,
                        token: 1
                    }
                }
            ];
            response = await paginationAggregate(dealerFcmTokenModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async save(data) {
        const response = { data: {}, status: false };
        try {
            const docData = await dealerFcmTokenModel.findOne({ token: data.token }) || new dealerFcmTokenModel();
            docData.token = data.token;
            docData.dealerId = data.dealerId;
            docData.dealerLoginId = data.dealerLoginId;

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
                await dealerFcmTokenModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })
            } else if (typeof ids === "string") {
                await dealerFcmTokenModel.updateOne({ _id: Types.ObjectId(ids) }, { isDeleted: true });
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }
}

module.exports = dealerFcmTokenServices;