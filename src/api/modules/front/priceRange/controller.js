const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');


class colorController {
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = {
                start: "500000",
                end: "5000000",
            }
            if (srvRes) {
                response.data = srvRes;
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

module.exports = colorController