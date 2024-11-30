const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const ratingDealerService = require('../../../../services/ratingDealer');

class brandController {
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await ratingDealerService.list({ ...req.body, cuserId: req.__cuser.id, toDealerId: req.params.toDealerId != 'my' ? req.params.toDealerId : req.__cuser.id });
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
    static async avg(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await ratingDealerService.avg(req.params.toDealerId);
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
            const srvRes = await ratingDealerService.save({ ...req.body, fromDealerId: req.__cuser._id });
            if (srvRes.status) {
                // response.data = srvRes.data;
                response.message = "Updated";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async delete(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await ratingDealerService.delete({ toDealerId: req.body.toDealerId, fromDealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = "Removed";
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
}

module.exports = brandController;