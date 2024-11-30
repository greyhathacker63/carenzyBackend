const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const service = require("../../../../services/dealerCar");
const dealerLeadServices = require('../../../../services/dealerLead');

class Controller {
    static async save(req, res) {
        try {
            const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code };
            const srvRes = await dealerLeadServices.save({ ...req.body, dealerFromId: req.__cuser._id });
            if (srvRes.status) {
                // response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await dealerLeadServices.listFront({ ...req.query, dealerToId11: req.__cuser._id });
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
}

module.exports = Controller
