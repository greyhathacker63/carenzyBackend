const dealerService = require('../../../../services/dealer');
const followService = require('../../../../services/follow');
const ratingDealerService = require('../../../../services/ratingDealer');
// const fileService = require('../../../../services/file');
const dealerCarService = require('../../../../services/dealerCar');
const dealerLoginService = require('../../../../services/dealerLogin');
const dealerFcmTokenService = require('../../../../services/dealerFcmToken');
const jwt = require("jsonwebtoken");
const smsService = require('../../../../services/sms');
const subscriptionService = require('../../../../services/subscription');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const { genRandomNumber, encryptData, decryptData } = require('./../../../../utilities/Helper');
const config = require('../../../../config');
const dealerModel = require('../../../../models/dealer')

class controller {

	static async validateToken(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const { data: subscriptionLastDate } = await subscriptionService.getDealerLastSubscriptionDate(req.__cuser._id)
			response.data = {
				incompleteAccount: req.__cuser.dealershipName ? false : true,
				verifcationStatus: req.__cuser.verifcationStatus,
				carAllowedIn: req.__cuser.carAllowedIn,
				subscriptionLastDate: subscriptionLastDate.lastDate
			};
			response.message = Message.dataFound.message;
			response.code = Message.dataFound.code;

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async sendOtp(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvResDealer = await dealerService.sendOtp(req.body);

			if (srvResDealer.status) {
				const srvResDealerLogin = await dealerLoginService.save({
					dealerId: srvResDealer.data._id,
					ip: req.socket.remoteAddress,
					otp: {
						value: req.body.phone == "0000000000" ? "0123" : genRandomNumber(4),
						time: new Date()
					}
				});

				response.data = {
					key: encryptData(srvResDealerLogin.data._id.toString())
				}

				await smsService.send('dealer-login-otp', { phone: req.body.phone, otp: srvResDealerLogin.data.otp.value });
				response.message = Message.otpSent.message;
				response.code = Message.otpSent.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async validateOtp(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerLoginService.details(decryptData(req.body.key));

			if (srvRes.status && srvRes.data) {
				if (srvRes.data.otp.value === req.body.otp) {
					await dealerLoginService.saveByKeys({ _id: decryptData(req.body.key), dateTime: new Date(), otp: {} });
					const { data: dealerData } = await dealerService.dealerData(srvRes.data.dealerId);
					if (req.body.fcmToken) {
						await dealerFcmTokenService.save({ token: req.body.fcmToken, dealerId: srvRes?.data?.dealerId, dealerLoginId: srvRes?.data?._id });
					}
					response.data = {
						dealerId: srvRes?.data?.dealerId,
						incompleteAccount: dealerData.incompleteAccount,
						token: jwt.sign(
							{
								sub: srvRes.data.dealerId.toString(),
								exp: Math.floor(Date.now() / 1000) + ((config.jwt.expDuration) * 60)
							},
							config.jwt.secretKey)
					};
					response.message = Message.otpValidateLogin.message;
					response.code = Message.otpValidateLogin.code;
				} else {
					response.message = "OTP is wrong";
				}
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async acceptTC(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.acceptTC({ _id: req.__cuser._id });

			response.data = { isTermsAccepted: srvRes?.data?.isTermsAccepted };
			response.message = Message.TCAccepted.message;
			response.code = Message.TCAccepted.code;

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}
	static async isTCvalidate(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.isTCvalidate({ _id: req.__cuser._id });

			response.data = { isTermsAccepted: srvRes?.data?.isTermsAccepted };
			response.message = Message.TCAccepted.message;
			response.code = Message.TCAccepted.code;

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}


	static async updateUser(req, res) {
		const { _id, name, email, address, pinCode, city, stateId } = req.body;
		if (!_id) {
			return res.json({
				status_code: false,
				message: "Please provide _id",
				data:{}
			});
		}
		const updateCriteria = {};
		if (name) updateCriteria.name = name;
		if (email) updateCriteria.email = email;
		if (address) updateCriteria.address = address;
		if (city) updateCriteria.city = city;
		if (stateId) updateCriteria.stateId = stateId;
		if (pinCode) updateCriteria.pinCode = pinCode;


		if (Object.keys(updateCriteria).length === 0) {
			return res.json({
				status_code: false,
				message: "Please provide any key to update",
				data: {}
			});
		}
		console.log("hi")
		try {
			const srvRes = await dealerModel.findByIdAndUpdate({ _id }, { $set: updateCriteria }, { new: true });
			if (!srvRes) {
				return res.json({
					status_code: false,
					message: "Please provide correct _id",
					data: {}
				});
			}
			return res.json({
				status_code: true,
				message: "Dealer updated successfully",
				data: srvRes
			});
		} catch (err) {
			return res.json({
				status_code: false,
				message: err.message,
				data: {}

			});
		}
	}


	static async updateUser(req, res) {
		const { _id, name, email, address, pinCode, city, stateId } = req.body;
		if (!_id) {
			return res.json({
				status_code: false,
				message: "Please provide _id",
				data:{}
			});
		}
		const updateCriteria = {};
		if (name) updateCriteria.name = name;
		if (email) updateCriteria.email = email;
		if (address) updateCriteria.address = address;
		if (city) updateCriteria.city = city;
		if (stateId) updateCriteria.stateId = stateId;
		if (pinCode) updateCriteria.pinCode = pinCode;


		if (Object.keys(updateCriteria).length === 0) {
			return res.json({
				status_code: false,
				message: "Please provide any key to update",
				data: {}
			});
		}
		console.log("hi")
		try {
			const srvRes = await dealerModel.findByIdAndUpdate({ _id }, { $set: updateCriteria }, { new: true });
			if (!srvRes) {
				return res.json({
					status_code: false,
					message: "Please provide correct _id",
					data: {}
				});
			}
			return res.json({
				status_code: true,
				message: "Dealer updated successfully",
				data: srvRes
			});
		} catch (err) {
			return res.json({
				status_code: false,
				message: err.message,
				data: {}

			});
		}
	}


	static async updateDealer(req, res) {
		const { _id, dealershipName, address, pinCode, city, stateId, shopPhotoUrl, aadhaarNo, adharFrontImgUrl, adharBackImgUrl, panNo, panCardimgUrl, crz } = req.body;
		if (!_id) {
			return res.json({
				status_code: false,
				message: "Please provide _id",
				data: {}
			});
		}
		const updateCriteria = {};
		if (dealershipName) updateCriteria.dealershipName = dealershipName;
		if (address) updateCriteria.address = address;
		if (city) updateCriteria.city = city;
		if (stateId) updateCriteria.stateId = stateId;
		if (pinCode) updateCriteria.pinCode = pinCode;
		if (shopPhotoUrl) updateCriteria.shopPhotoUrl = shopPhotoUrl;
		if (aadhaarNo) updateCriteria.aadhaarNo = aadhaarNo;
		if (adharFrontImgUrl) updateCriteria.adharFrontImgUrl = adharFrontImgUrl;
		if (adharBackImgUrl) updateCriteria.adharBackImgUrl = adharBackImgUrl;
		if (panNo) updateCriteria.panNo = panNo;
		if (panCardimgUrl) updateCriteria.panCardimgUrl = panCardimgUrl;
		if (crz) updateCriteria.crz = crz;

		if (Object.keys(updateCriteria).length === 0) {
			return res.json({
				status_code: false,
				message: "Please provide any key to update",
				data: {}
			});
		}

		try {
			const srvRes = await dealerModel.findByIdAndUpdate({ _id }, { $set: updateCriteria }, { new: true });
			if (!srvRes) {
				return res.json({
					status_code: false,
					message: "Please provide correct _id",
					data: {}
				});
			}
			return res.json({
				status_code: true,
				message: "Dealer updated successfully",
				data: srvRes
			});
		} catch (err) {
			return res.json({
				status_code: false,
				message: err.message,
				data: {}
			});
		}
	}

	static async dealerData(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.dealerData(req.__cuser._id);
			if (srvRes.status) {
				const { data: followCount } = await followService.count({ dealerId: req.__cuser._id });
				const { data: dealerCarCount } = await dealerCarService.count({ dealerId: req.__cuser._id });
				const { data: rating } = await ratingDealerService.avg(req.__cuser._id);
				const postCount = dealerCarCount?.map(v => v.count)?.reduce((p, c) => p + c, 0) || 0;
				const soldCount = dealerCarCount?.filter(v => v._id.status == "Sold")?.map(v => v.count)?.reduce((p, c) => p + c, 0) || 0;
				response.data = {
					...srvRes.data,
					followersCount: followCount.followerCount,
					followingCount: followCount.followingCount,
					post: postCount - soldCount,
					sold: soldCount,
					rating: rating
				};
				response.message = Message.dataFound.message;
				response.code = Message.dataFound.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async dealerUpdate(req, res) {
		try {
			const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			// const crzNumber = req.__cuser.crz ? req.__cuser.crz : await dealerService.generateNextCRZNumber();
			// const crzNumber = req.__cuser.crz ? req.__cuser.crz : null

			// const srvRes = await dealerService.dealerUpdate({ crz: crzNumber, ...JSON.parse(JSON.stringify(req.__cuser)), ...req.body, _id: req.__cuser._id });
			const srvRes = await dealerService.dealerUpdate({ ...JSON.parse(JSON.stringify(req.__cuser)), ...req.body, _id: req.__cuser._id });

			if (srvRes.status) {
				response.message = Message.profileUpdate.message;
				response.code = Message.profileUpdate.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async dealerProfileAvatarChange(req, res) {
		try {
			const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			// const fileSrvRes = await fileService.save(req);
			const srvRes = await dealerService.dealerUpdateKeyWise({ _id: req.__cuser._id, ...req.body /* avatar: fileSrvRes.data.url */ });

			if (srvRes.status) {
				response.message = Message.profilePicUpdate.message;
				response.code = Message.profilePicUpdate.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async dealerShopImgChange(req, res) {
		try {
			const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			// const fileSrvRes = await fileService.save(req);
			const srvRes = await dealerService.dealerUpdateKeyWise({ _id: req.__cuser._id, ...req.body /* shopPhotoUrl: fileSrvRes.data.url */ });

			if (srvRes.status) {
				response.message = Message.profileShopPicUpdate.message;
				response.code = Message.profileShopPicUpdate.code;
			}
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async updateTermsAcceptance(req, res) {
		try {
			const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.saveDealerByKeys({ _id: req.__cuser._id, termAccepted: req.body.termAccepted });

			if (srvRes.status) {
				response.data = null;
				response.message = req.body.termAccepted ? "Terms & Condition Accepted" : "Terms & Condition Not Accepted";
				response.code = Message.msgOk.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async getTermsAcceptance(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.dealerData(req.__cuser._id);

			if (srvRes.status && srvRes.data) {
				response.data = {
					termAccepted: Boolean(srvRes.data?.termAccepted)
				};
				response.message = Message.dataFound.message;
				response.code = Message.dataFound.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async otherDealerData(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.dealerData(req.params._id);
			if (srvRes.status) {
				const { data: followCount } = await followService.count({ dealerId: req.__cuser._id });
				const { data: followingInfo } = await followService.checkIfFollowing({ followerId: req.__cuser._id, followingId: req.params._id });
				const { data: dealerCarCount } = await dealerCarService.count({ dealerId: req.params._id });
				const { data: rating } = await ratingDealerService.avg(req.params._id);
				const postCount = dealerCarCount?.filter(v => v._id.dealerId.toString() == req.params._id)?.map(v => v.count)?.reduce((p, c) => p + c, 0) || 0;
				const soldCount = dealerCarCount?.filter(v => v._id.dealerId.toString() == req.params._id && v._id.status == "Sold")?.map(v => v.count)?.reduce((p, c) => p + c, 0) || 0;
				response.data = {
					myProfile: req.params._id.toString() === req.__cuser._id.toString(),
					followersCount: followCount.followerCount,
					followingCount: followCount.followingCount,
					following: followingInfo.following,
					post: postCount,
					sold: soldCount,
					_id: srvRes.data._id,
					phones: srvRes.data.phones,
					name: srvRes.data.name ? srvRes.data.name : "Carenzy Dealer",
					dealershipName: srvRes.data.dealershipName,
					avatar: srvRes.data.avatar ? srvRes.data.avatar : "https://admin.carenzy.com/favicon.svg",
					shopPhotoUrl: srvRes.data.shopPhotoUrl,
					rating: rating || null,
					bio: srvRes.data.bio || null,
				};
				response.message = Message.dataFound.message;
				response.code = Message.dataFound.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async deleteDealer(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await dealerService.deleteDealer(req.__cuser._id);
			if (srvRes.status) {
				response.message = Message.accountDeleted.message;
				response.code = Message.accountDeleted.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	// Distinct location
	static async listDistinctLocation(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await dealerService.listDistinctLocation({ ...req.query });
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
}

module.exports = controller;