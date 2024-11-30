const { Types } = require("mongoose");
const dealerSubscriptionModel = require("../models/dealerSubscription");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class Services {
    // Plan services : 
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await dealerSubscriptionModel.findOne({
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
                phones: query.phone ? query.phone : '',
                dealerId: query.dealerId ? Array.isArray(query.dealerId) ? { $in: query.dealerId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
            ];
            response = await paginationAggregate(dealerSubscriptionModel, $aggregate, $extra);
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
            const docData = _id ? await dealerSubscriptionModel.findById(_id) : new dealerSubscriptionModel();

            docData.planId = data.planId;
            docData.dealerId = data.dealerId;
            docData.transactionid = data.transactionid;
            docData.name = data.name;
            docData.duration = data.duration;
            docData.startDate = data.startDate;
            docData.endDate = data.endDate;
            docData.benefits = data.benefits;
            docData.isByAdmin = data.isByAdmin;
            docData.ammountInBank = data.ammountInBank;
            docData.receipt = data.receipt;
            docData.allotAdminId = data.allotAdminId;
            docData.rejectionReason = data.rejectionReason;
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
                await dealerSubscriptionModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await dealerSubscriptionModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }
    }

    static async getSubscriptionLastDate(data) {
        const response = { data: {}, status: false };
        try {
            const allSubscriptions = this.list({ dealerId: data.dealerId, isAll: 1 });

            response.data = {
                subscriptions: allSubscriptions,
                lastData: allSubscriptions?.[allSubscriptions?.length - 1]?.endDate
            };
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }
    }
}

module.exports = Services