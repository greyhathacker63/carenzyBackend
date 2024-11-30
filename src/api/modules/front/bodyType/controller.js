const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const Services = require('../../../../services/bodyType');


class Controller {
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await Services.listFront({ ...req.query });
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