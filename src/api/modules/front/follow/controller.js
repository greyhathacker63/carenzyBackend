const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const followService = require("../../../../services/follow");

class brandController {

    static async details(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await followService.details(req.__cuser._id);

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
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            if (req.query.following == 1 || req.query.following == 0) {
                const srvRes = await followService.list({
                    ...req.body,
                    followerId: req.query.following == 1 ? req.__cuser._id : null,
                    followingId: req.query.following == 0 ? req.__cuser._id : null,
                });
                if (srvRes.data.length) {
                    response.data = srvRes.data;
                    response.message = Message.dataFound.message;
                    response.code = Message.dataFound.code;
                }
                response.extra = srvRes.extra;
            }

            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async count(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await followService.count({ ...req.body, dealerId: req.__cuser._id });
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
    static async save(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await followService.save({ ...req.body, followerId: req.__cuser._id });
            if (srvRes.status) {
                // response.data = srvRes.data;
                response.message = "You started following the dealer";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async remove(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await followService.delete({ ...req.body, followerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = "Unfollowed the dealer";
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
}

module.exports = brandController;