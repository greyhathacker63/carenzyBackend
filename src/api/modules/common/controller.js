const Response = require('../../../utilities/Response');
const Message = require('../../../utilities/Message');
const applicationService = require('../../../services/application');
const appFeedbackService = require('../../../services/appFeedback');
const { maskSensitiveData } = require('../../../utilities/Helper');
const configurationServices = require('../../../services/configuration');
const dealerCarMarketPlaceServices = require('../../../services/dealerCarMarketPlace');
const rtoServices = require('../../../services/rto');
const dealerService = require('../../../services/dealer');
const brandModelServices = require('../../../services/brandModel');

class blogController {
    static async applicationData(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await applicationService.details({type: req.params.type});
            if (srvRes.data) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }
            res.send(srvRes.data.data);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async feedbackForm(req, res) {
		try {
			const srvRes = await appFeedbackService.feedbackForm(req.params._id);

			res.send(srvRes);

		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}
	static async saveFeedback(req, res) {
		try {
			const response = {message: "We have saved your feedback. Thankyou!!", code: Message.dataSaved.code};
			const srvRes = await appFeedbackService.saveFeedback({ ...req.body });
			if(srvRes.status){
				response.message = Message.dataSaved.message;
				response.code = Message.dataSaved.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataDeletionError, err));
		}
	}
	static async feedbackFormKeyenzy(req, res) {
		try {
			const srvRes = await appFeedbackService.feedbackFormKeyenzy(req.params._id);

			res.send(srvRes);

		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

    static async listMarketPlace(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const search = {
                // type: "Market",
                status: "In List",
                ...req.query,
            };
            if (req.query.key) {
                const { data: dealersFound } = await dealerService.listDealer({ key: req.query.key, isAll: 1 });
                search.keyWiseDealerId = [...dealersFound.map(v => v._id.toString())];

                const { data: rtosFound } = await rtoServices.listFront({ isAll: 1, key: req.query.key });
                search.keyWiseRtoId = rtosFound.map(v => v._id.toString());
            }
            if (req.query.stateId) {
                const { data: rtoIds } = await rtoServices.listFront({ isAll: 1, stateId: req.query.stateId });
                search.rtoId = rtoIds.map(v => v._id.toString());
            }
            if (req.query.bodyTypeId) {
                const { data: models } = await brandModelServices.listFront({ isAll: 1, bodyTypeId: req.query.bodyTypeId });
                const modelIds = models.map(v => v._id.toString());
                if (search.modelId) {
                    if (Array.isArray(search.modelId)) {
                        search.modelId = [...search.modelId, ...modelIds];
                    } else {
                        search.modelId = [search.modelId, ...modelIds];
                    }
                } else {
                    search.modelId = modelIds;
                }
            }
            if (req.query.onlyTotal && !Object.keys(req.query).find(v => !(['page', 'total', 'onlyTotal', 'limit'].includes(v)))) {
                response.extra = {
                    total: (await configurationServices.details({ type: 'Market Car Count' })).data.value * 1 || 0,
                    page: 0,
                    limit: 0
                }
                // const { data: { value } } = await configurationServices.details({ type: 'Add Extra Number In Market Car Count' });
                // response.extra.total = response.extra.total + ((value * 1) || 0);
            } else {
                const srvRes = await dealerCarMarketPlaceServices.list(search);
                if (srvRes.data.length) {
                    response.data = maskSensitiveData(JSON.parse(JSON.stringify(srvRes.data)));
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
}

module.exports = blogController;