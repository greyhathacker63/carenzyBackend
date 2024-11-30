const cityService = require('../../../../services/city');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const RTO_services = require('../../../../services/rto');

class controller {
    static async details(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await cityService.details(req.params._id);

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
			const srvRes = await cityService.list(req.query);
			
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
			const srvRes = await cityService.save({ ...req.body });
			if(srvRes.status){
				// Creating RTO for the created City: 
				const rtoRes = await RTO_services.save({...req.body});
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
			const srvRes = await cityService.delete(req.body.ids);
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