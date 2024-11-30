const applicationService = require('../../../../services/application');
const contactusServices = require("../../../../services/contact-us");
const metadataService = require("../../../../services/metadata");
const reportProblemService = require("../../../../services/report-problem");
const configurationService = require("../../../../services/configuration");
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

class controller {

    static async detailsApplication(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await applicationService.details({ type: req.params.type });
            if (srvRes.status) {
                response.data = srvRes.data?.data || "";//{ ...srvRes.data, type: undefined, _id: undefined, __v: undefined };
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async listContactus(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await contactusServices.list({ type: ['phone', 'email', 'whatsapp'] });
            if (srvRes.data.length) {
                response.data = srvRes.data.map(v => ({ ...v, _id: undefined }));
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }

    // All Enum Controller
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await metadataService.list({ ...req.query, type: req.params.type });
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
    static async listVideoTutorial(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await configurationService.list({ type: 'Video Tutorial Url', isAll: 1 });
            if (srvRes.data.length) {
                response.data = srvRes.data.map(v => v.value);
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

module.exports = controller;