const service = require('../../../../services/file');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

module.exports = class UserController {

	static async save(req, res) {
		try {
			const srvRes = await service.save(req.file);
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}
	static async saveMultiple(req, res) {
		const response = { data: [], message: Message.internalServerError.message, code: Message.internalServerError.code };

		try {
			for (let i = 0; i < req.files.length; i++) {
				const { data } = await service.save(req.files[i]);
				response.data.push(data);
			}
			response.message = 'Files uploaded';
			response.code = Message.dataSaved.code;
			Response.success(res, response);
		} catch (e) {
			Response.fail(res, e);
		}
	}

	static async remove(req, res) {
		try {
			const srvRes = await service.remove(req.body);
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}

}