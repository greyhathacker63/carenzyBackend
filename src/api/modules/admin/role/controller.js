const roleService = require('../../../../services/role');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

class controller {

	static async list(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await roleService.list(req.query);
			
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
			const response = {message: Message.internalServerError.message, code: Message.internalServerError.code};
			const srvRes = await roleService.save({ ...req.body });
			if(srvRes.status){
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
			const srvRes = await roleService.delete(req.body.ids);
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