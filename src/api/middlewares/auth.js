const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const Logger = require('../../utilities/Logger');
const Response = require('../../utilities/Response');
const Message = require('../../utilities/Message');
const config = require('../../config');
const masterAdminModule = require('../../models/admin');

module.exports = {
	validateToken: async (req, res, next) => {
		try {
			if (req.headers.authorization) {
				const authorization = req.headers.authorization.trim();

				if (authorization.startsWith('Bearer ')) {
					const bearer = req.headers.authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);

					try {
						const cuser = await masterAdminModule.findById(decode.sub);
						if (!cuser) {
							throw new Error();
						} else if (!cuser.status) {
							Response.fail(res, 'Account is blocked. Contact Admin!!', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						}
						req.__cuser = cuser;
					} catch (e) {
						Logger.error('User does not exist');
						throw new Error();
					}

					next();
				} else {
					Logger.error('Invalid authorization value');
					throw Response.createError(Message.invalidToken);
				}
			} else {
				throw new Error();
			}

		} catch (e) {
			Logger.error('AuthMiddleware Failed : ', e);
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

	validateSuperAdmin: async (req, res, next) => {
		try {
			if (req.__cuser && req.__cuser.type === 'superAdmin') {
				next();
			} else {
				throw new Error();
			}
		} catch (e) {
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

	validateSubAdmin: async (req, res, next) => {
		try {
			if (req.__cuser && req.__cuser.type === 'subAdmin') {
				next();
			} else {
				throw new Error();
			}
		} catch (e) {
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

	checkRight: (key) => {
		return function (req, res, next) {
			if (req.__cuser?.adminRights?.includes(key) || req.__cuser?.type === 'superAdmin') {
				next();
			} else {
				Response.fail(res, 'Unauthorized!', HttpStatus.StatusCodes.UNAUTHORIZED);
			}
		}
	},
	checkRightDelete: (key) => {
		return function (req, res, next) {
			if (req.__cuser?.adminRights?.includes(key) || req.__cuser?.type === 'superAdmin') {
				next();
			} else {
				Response.fail(res, 'Unauthorized!', HttpStatus.StatusCodes.UNAUTHORIZED);
			}
		}
	},
	checkRightDetail: (key) => {
		return function (req, res, next) {
			if (req.__cuser?.adminRights?.includes(key) || req.__cuser?.type === 'superAdmin') {
				next();
			} else {
				Response.fail(res, 'Unauthorized!', HttpStatus.StatusCodes.UNAUTHORIZED);
			}
		}
	},

	checkRightSave: (addKey, editKey) => {
		return function (req, res, next) {
			if (req.body._id) {
				if (req.__cuser?.adminRights?.includes(editKey) || req.__cuser?.type === 'superAdmin') {
					next();
				} else {
					Response.fail(res, 'Unauthorized!', HttpStatus.StatusCodes.UNAUTHORIZED);

				}
			} else {
				if (req.__cuser?.adminRights?.includes(addKey) || req.__cuser?.type === 'superAdmin') {
					next();
				} else {
					Response.fail(res, 'Unauthorized!', HttpStatus.StatusCodes.UNAUTHORIZED);
				}
			}
		}
	},

	validateTokenSocketio: async (authorization) => {
		authorization = authorization.trim();
		const res = { status: false, __cuser: {} };
		try {
			if (authorization) {

				if (authorization.startsWith('Bearer ')) {
					const bearer = authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);

					try {
						const cuser = await masterAdminModule.findById(decode.sub);
						if (cuser && cuser.status) {
							res.status = true;
							res.__cuser = cuser;
						}
					} catch (e) {
						throw new Error();
					}
				} else {
				}
			} else {
				throw new Error();
			}

		} catch (e) { } finally {
			return res
		}
	},

};