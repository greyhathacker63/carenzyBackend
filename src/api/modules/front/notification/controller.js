const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const notificationService = require('../../../../services/notification');


class subscriptionController {
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await notificationService.listFront({
                ...req.query,
                dealerId: req.__cuser._id,
                lastId: req.query.type == 'General' ? req.__cuser.lastGeneralNotificationId : req.__cuser.lastBidNotificationId,
                type: req.query.type == 'General' ? ['General', 'Car In Bidding', 'Car In Market'] : ['Market Offer Received', 'Bidding Offer Received']
            });
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
    static async clearNotification(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await notificationService.clearNotification({ dealerId: req.__cuser._id, type: req.params.type });
            if (srvRes.status) {
                response.message = 'Notification cleared';
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