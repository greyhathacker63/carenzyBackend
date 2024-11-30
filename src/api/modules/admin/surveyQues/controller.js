const surveyQuesService = require('../../../../services/surveyQues');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const surveyQuesOptionsService = require('../../../../services/surveyQuesOptions');

class controller {
    static async details(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await surveyQuesService.details(req.params._id);

            if (srvRes.data?._id) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
	static async list(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await surveyQuesService.list(req.query);
			
			if(srvRes.data.length){
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
			const response = {data: {},message: Message.internalServerError.message, code: Message.internalServerError.code};
			const srvRes = await surveyQuesService.save({ ...req.body });
			if(srvRes.status){
				const options = req.body.options;
				options.forEach(async (v) => {
					await surveyQuesOptionsService.save({isCorrect: v.isCorrect, title:v.title, surveyQuestionId: srvRes.data._id })
				})
				response.data = srvRes.data;
				response.message = Message.dataSaved.message;
				response.code = Message.dataSaved.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataDeletionError, err));
		}
	}
	static async delete(req, res) {
		try {
			const response = {message: Message.dataDeletionError.message, code: Message.dataDeletionError.code};
			const srvRes = await surveyQuesService.delete(req.body.ids);
			if(srvRes.status){
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