const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const colorServices = require('../../../../services/color');
const brandModelServices = require('../../../../services/brandModel');


class colorController {
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const colorIds = req.query.brandModelId ? (await brandModelServices.details(req.query.brandModelId))?.data?.colorIds : [];
            const srvRes = await colorServices.listFront({ ...req.query, _id: colorIds?.length && colorIds?.map(v => v?.toString()) });
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

module.exports = colorController