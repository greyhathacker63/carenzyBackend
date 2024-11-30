const adminService = require('../../../../services/admin');
const dealerService = require('../../../../services/dealer');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const followServices = require('../../../../services/follow');

class controller {
	static async login(req, res) {


		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await adminService.login({ email: req.body.email, password: req.body.password });

			if (srvRes.status) {
				response.data = srvRes.data;
				response.message = 'Loggedin successfully';
				response.code = 200;
			}

			response.extra = srvRes.extra;
			Response.success(res, response);
		} catch (err) {
			// Response.fail(res, Response.createError(Message.dataFetchingError, err));
			Response.fail(res, err);
		}
	}
	static async validateToken(req, res) {
		try {
			Response.success(res, { message: 'Authorized', data: { type: req.__cuser.type } });
		} catch (e) {
			Response.fail(res, e);
		}
	}
	static async updatePassword(req, res) {
		try {
			const srvRes = await adminService.updatePassword({ ...req.body, _id: req.__cuser._id });
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}
	static async profile(req, res) {
		try {
			const srvRes = await adminService.profile(req.__cuser);
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}
	static async saveProfile(req, res) {
		try {
			const srvRes = await adminService.saveProfile(req.body, req.__cuser);
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}

	static async changeAvatar(req, res) {
		try {
			const srvRes = await adminService.changeAvatar({ ...req.body, adminId: req.__cuser._id });
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}

	static async list(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await adminService.list(req.query);

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
	static async save(req, res) {
		try {
			const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
			const srvRes = await adminService.save({ ...req.body });
			if (srvRes.status) {
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
			const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
			const srvRes = await adminService.delete(req.body.ids);
			if (srvRes.status) {
				response.message = Message.dataDeleted.message;
				response.code = Message.dataDeleted.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataDeletionError, err));
		}
	}

	/// Dealer controller

	static async listDealer(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await dealerService.listDealer(req.query);
			const data = await Promise.all(
				srvRes.data.map(async (v) => await followServices.count({ dealerId: v?._id }))
			)
			srvRes.data = srvRes.data.map((v, i) => ({ ...v, followDetails: data[i]?.data, sold: "15", post: "69" }));
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

	static async saveDealer(req, res) {
		try {
			const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
			const srvRes = await dealerService.saveDealer({
				...req.body,
				avatar: req.body.avatar ?? null,
				adharFrontImgUrl: req.body.adharFrontImgUrl ?? null,
				adharBackImgUrl: req.body.adharBackImgUrl ?? null,
				panCardimgUrl: req.body.panCardimgUrl ?? null,
				shopPhotoUrl: req.body.shopPhotoUrl ?? null,
				registrationCertImgUrl: req.body.registrationCertImgUrl ?? null,
				gstImgUrl: req.body.gstImgUrl ?? null,
			});
			if (srvRes.status) {
				response.message = Message.dataSaved.message;
				response.code = Message.dataSaved.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataDeletionError, err));
		}
	}

	static async detailsDealer(req, res) {
		try {
			const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await dealerService.detailsDealer({ _id: req.params._id });

			if (srvRes.data?._id) {
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
	static async deleteDealer(req, res) {
		try {
			const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
			const srvRes = await dealerService.deleteDealer(req.body.ids);
			if (srvRes.status) {
				response.message = Message.dataDeleted.message;
				response.code = Message.dataDeleted.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataDeletionError, err));
		}
	}

	static async generateNextCRZNumber(req, res) {
		try {
			const response = { data: null, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const crzNumber = await dealerService.generateNextCRZNumber();
			if (crzNumber.length) {
				response.data = crzNumber;
				response.message = Message.dataFound.message;
				response.code = Message.dataFound.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

}

module.exports = controller;