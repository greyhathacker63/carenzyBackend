const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const Logger = require('../../utilities/Logger');
const Response = require('../../utilities/Response');
const Message = require('../../utilities/Message');
const config = require('../../config');
const masterAdminModule = require('../../models/masterAdmin');

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
	}
};

