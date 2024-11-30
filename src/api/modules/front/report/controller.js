const reportProblemService = require("../../../../services/report-problem");
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

class controller {
    static async details(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await reportProblemService.details(req.params._id);

            if (srvRes.data?._id) {
                response.data = {
                    _id: srvRes.data._id,
                    message: srvRes.data.message,
                    metadataId: srvRes.data.metadataId,
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
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await reportProblemService.listFront({ ...req.query, dealerId: req.__cuser._id });
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
    static async save(req, res, next) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await reportProblemService.save({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.data = null;// srvRes.data;
                response.message = Message.dataSaved.message;
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
            const srvRes = await reportProblemService.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
}

module.exports = controller;