const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const subscriptionService = require('../../../../services/subscription');
const subscriptionModel = require('../../../../models/subscription');
const plan = require('../../../../models/plan');
const { Types } = require('mongoose');
const transactionService = require('../../../../services/transaction');


class subscriptionController {
    static async subscriptionDetails(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subscriptionService.details(req.params._id);

            if (srvRes.data?._id) {
                response.data = srvRes.data;
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
            const srvRes = await subscriptionService.list(req.query);
            if (srvRes.data.length) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async subscriptionSave(req, res, next) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const { data: transactionDetails } = await transactionService.save({
                date: new Date(),
                amount: req.body.amount,
                receiptUrl: req.body.receiptUrl,
                dealerId: req.body.dealerId
            });
            const srvRes = await subscriptionService.save({
                ...req.body,
                allotedBy: req.__cuser._id,
                transactionDetails: JSON.stringify(transactionDetails),
                transactionId: transactionDetails._id
            });
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
    }

    static async getDealerLastSubscriptionDate(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subscriptionService.getDealerLastSubscriptionDate(req.params.dealerId);

            if (srvRes.status) {
                response.data = srvRes.data;
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