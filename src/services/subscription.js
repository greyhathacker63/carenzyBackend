const { Types } = require("mongoose");
const subscriptionModel = require("../models/subscription");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");
const config = require('../config');
const axios = require('axios');
const crypto = require('crypto');
class subscriptionService {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await subscriptionModel.findOne({
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
                dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : "",
                status: query.status ? (query.status == 1 ? true : false) : "",
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { startDate: -1 } }
            ];
            response = await paginationAggregate(subscriptionModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async save(data) {
        const response = { data: {}, status: false };
        try {
            const docData = await subscriptionModel.findOne({ transactionId: Types.ObjectId(data.transactionId) }) || new subscriptionModel();

            docData.transactionId = data.transactionId ? data.transactionId : null;
            docData.allotedBy = data.allotedBy ? data.allotedBy : null;
            docData.planId = data.planId;
            docData.dealerId = data.dealerId;
            docData.planName = data.planName;
            docData.paidAmount = data.paidAmount;
            docData.duration = data.duration;
            docData.startDate = data.startDate;
            docData.endDate = data.endDate;
            docData.planDetails = data.planDetails;
            docData.transactionDetails = data.transactionDetails;
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
                await subscriptionModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await subscriptionModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }

    static async getDealerLastSubscriptionDate(dealerId) {
        const response = { data: { lastDate: null }, status: false };
        try {
            const { data: subscriptionList } = await this.listForFront({ dealerId: dealerId, isAll: 1 });


            response.data.lastDate = subscriptionList?.[0]?.endDate || null;

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    /* Dealer services */

    static async listForFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : '',
                status: true,
                isDeleted: false
            };

            clearSearch(search);
            const $aggregate = [
                // { $match: search }, // remove this as we are using it make all dealers use application
                { $sort: { startDate: -1 } },
                {
                    $project: {
                        name: 1,
                        planDetails: 1,
                        planName: 1,
                        paidAmount: 1,
                        startDate: 1,
                        endDate: 1,
                        createdAt: 1
                    }
                },
            ];
            response = await paginationAggregate(subscriptionModel, $aggregate, $extra);
            response.data = response.data.map(v => ({ ...v, planDetails: JSON.parse(v.planDetails) }))
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async detailsForFront(query = {}) {
        const response = { data: {}, status: false };
        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : "",
                dealerId: query.dealerId ? Types.ObjectId(query.dealerId) : "",
                status: true
            };

            clearSearch(search);

            response.data = JSON.parse(JSON.stringify(await subscriptionModel.findOne(search)));

            response.data = {
                ...response.data,
                planDetails: JSON.parse(response.data.planDetails),
            }
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }
    }

    static async subscriptionInit({ transactionDetails, planDetails }) {
        const response = { data: {}, status: false };
        try {
            const paymentDetails = await this.initPhonepe(transactionDetails, planDetails);

            response.data = paymentDetails;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async initPhonepe(transactionDetails, planDetails) {
        try {
            const data = {
                merchantId: config.phonePe.merchantId,
                merchantTransactionId: transactionDetails._id,
                merchantUserId: transactionDetails.dealerId,
                amount: transactionDetails.amount * 100,// 10,
                redirectUrl: config.phonePe.redirectUrl,
                redirectMode: 'POST',
                callbackUrl: config.phonePe.callbackUrl,
                mobileNumber: "8826648669",
                paymentInstrument: {
                    type: 'PAY_PAGE'
                },
                param1: 'YOUR_CUSTOM_DATA_1',
            };
            const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
            const finalXHeader = crypto.createHash('sha256').update(encodedData + '/pg/v1/pay' + config.phonePe.saltKey).digest('hex') + '###' + config.phonePe.saltKeyIndex;
            let response = {};
            if (planDetails.getpaymentUrl) {
                response = await axios.post(
                    process.env.PHONEPE_BASEURL + 'pay',
                    { request: encodedData },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-VERIFY': finalXHeader
                        }
                    }
                );
            }

            return { ...response.data, encodedData, finalXHeader, transactionId: transactionDetails._id };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = subscriptionService;