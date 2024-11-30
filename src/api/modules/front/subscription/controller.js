const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const subscriptionService = require('../../../../services/subscription');
const transactionService = require('../../../../services/transaction');
const moment = require("moment");
const querystring = require('querystring');


class subscriptionController {
    static async subscriptionDetails(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subscriptionService.detailsForFront({ _id: req.params._id, dealerId: req.__cuser._id });

            if (srvRes.data?._id) {
                response.data = {
                    ...srvRes.data,
                    planDetails: {
                        ...srvRes.data.planDetails,
                        numberOfUses: undefined,
                        status: undefined
                    },
                    startDate: moment(new Date(srvRes.data.startDate)).format("DD MMM YYYY [at] hh:mmA"),
                    endDate: moment(new Date(srvRes.data.endDate)).format("DD MMM YYYY [at] hh:mmA"),
                    createdAt: moment(new Date(srvRes.data.createdAt)).format("DD MMM YYYY [at] hh:mmA"),
                    status: undefined,
                    isDeleted: undefined,
                    allotedBy: undefined,
                    planId: undefined,
                    dealerId: undefined,
                    updatedAt: undefined,
                    __v: undefined,
                    transactionDetails: undefined
                };
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }

    static async subscriptionList(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subscriptionService.listForFront({ ...req.query, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.data = srvRes.data.map(v => (
                    {
                        ...v,
                        startDate: moment(new Date(v.startDate)).format("DD MMM YYYY"),
                        endDate: moment(new Date(v.endDate)).format("DD MMM YYYY"),
                        createdAt: moment(new Date(v.createdAt)).format("DD MMM YYYY [at] hh:mmA"),
                        planDetails: {
                            ...v.planDetails,
                            numberOfUses: undefined,
                            status: undefined
                        }
                    }
                ));
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }

    static async purchaseSubscriptionInit(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const { data: transactionDetails } = await transactionService.save({
                date: new Date(),
                amount: req.body.paidAmount,
                dealerId: req.__cuser._id,
                planDetails: req.body.planDetails
            });
            const srvRes = await subscriptionService.subscriptionInit({ transactionDetails, planDetails: req.body });
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }

    static async purchaseSubscriptionMob(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const { data: transactionDetails } = await transactionService.details(req.body.transactionId);
            const srvRes = await subscriptionService.save({
                ...JSON.parse(transactionDetails.planDetails),
                planDetails: (transactionDetails.planDetails),
                transactionDetails: JSON.stringify(transactionDetails),
                transactionId: transactionDetails._id
            });
            if (srvRes.status) {
                await transactionService.savePaymentDetails({ _id: transactionDetails._id, paymentDetails: req.body?.paymentDetails ? JSON.stringify(req.body.paymentDetails) : "" });
                response.data = null;
                response.message = Message.subscriptionPurchased.message;
                response.code = Message.subscriptionPurchased.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }

    static async purchaseSubscription(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
                const paymentDetails = querystring.parse(body);
                const { data: transactionDetails } = await transactionService.details(paymentDetails.transactionId);
                const srvRes = await subscriptionService.save({
                    ...JSON.parse(transactionDetails.planDetails),
                    planDetails: (transactionDetails.planDetails),
                    transactionDetails: JSON.stringify(transactionDetails),
                    transactionId: transactionDetails._id
                });
                if (srvRes.status) {
                    await transactionService.savePaymentDetails({ _id: transactionDetails._id, paymentDetails: JSON.stringify(paymentDetails) });
                    response.data = null;//srvRes.data;
                    response.message = Message.subscriptionPurchased.message;
                    response.code = Message.subscriptionPurchased.code;
                }
                Response.success(res, response);
            });
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    /*  
        static async subscriptionDelete(req, res) {
            try {
                const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
                const srvRes = await subscriptionService.delete(req.body.ids);
                if (srvRes.status) {
                    response.message = Message.dataDeleted.message;
                    response.code = Message.dataDeleted.code;
                }
                Response.success(res, response);
            } catch (err) {
                Response.fail(res, Response.createError(Message.dataDeletionError, err));
            }
        } */

    static async getDealerLastSubscriptionDate(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subscriptionService.getDealerLastSubscriptionDate(req.__cuser._id);

            if (srvRes.status) {
                response.data = {
                    ...srvRes.data,
                    lastDateFormat: moment(new Date(srvRes.data.lastDate)).format("DD MMM YYYY [at] hh:mmA")
                };
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
}

module.exports = subscriptionController;