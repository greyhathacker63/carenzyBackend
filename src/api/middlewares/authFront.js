const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const Response = require('../../utilities/Response');
const Message = require('../../utilities/Message');
const config = require('../../config');
const userModel = require('../../models/dealer');
const subscriptionService = require('../../services/subscription');

module.exports = {

	setCuserInfo: async function (req, res, next) {
		try {
			const bearer = req.headers.authorization.split(" ");
			const token = bearer[1];
			const decode = jwt.verify(token, config.jwt.secretKey);

			const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
			req.__cuser = cuser;
			req.query.ln = cuser?.preferredLn || 'en';
		} catch (e) { } finally {
			next();
		}
	},


	validateToken: async function (req, res, next) {
		// try {
			// if (req.headers.authorization) {
				// const authorization = req.headers.authorization.trim();

				// if (authorization.startsWith('Bearer ')) {
					// const bearer = req.headers.authorization.split(" ");
					// const token = bearer[1];
					// const decode = jwt.verify(token, config.jwt.secretKey);

					// try {
						const _id = "64ab9c57fe853288371fa343"
						const cuser = await userModel.findOne({ _id, isDeleted: false });
						if (!cuser) {
							throw new Error();
						} else if (!cuser.status) {
							Response.fail(res, 'Account is blocked. Contact Admin!!', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						}
						req.__cuser = cuser;
						req.__cuser.verifcationStatus = true; // remove this as we are using it make all dealers use application
						const { data: subscriptionData } = await subscriptionService.getDealerLastSubscriptionDate(cuser._id);
						req.__cuser.subscriptionData = subscriptionData;
						req.__cuser.subscriptionExpired = subscriptionData.lastDate ? new Date(subscriptionData.lastDate) < new Date() : true;
					// } catch (e) {
					// 	throw new Error();
					// }

					next();
				// } else {
				// 	throw Response.createError(Message.invalidToken);
				// }
			// } else {
			// 	throw new Error();
			// }

		// } catch (e) {
		// 	Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		// }
	},

	verificationCheck: async function (req, res, next) {
		try {
			if (!req.__cuser.verifcationStatus) {
				throw new Error();
			}
			next();
		} catch (e) {
			Response.fail(res, 'Account under verification.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},


	checkPlanPurchased: async (req, res, next) => {
		try {
			if (req.__cuser.planPurchased) {
				next();
			} else {
				throw new Error();
			}
		} catch (e) {
			Response.fail(res, 'Plan not purchased', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

};