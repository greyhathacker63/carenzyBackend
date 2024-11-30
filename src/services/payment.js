// const { Types } = require("mongoose");
// const Order = require("../models/order");
// const { paginationAggregate } = require("../utilities/pagination");
// const { clearSearch, getDateWithoutTime, encryptCCAV, decryptCCAV, isValidObjectId } = require("../utilities/Helper");
const config = require('../config');
const axios = require('axios');
const crypto = require('crypto');

class paymentServices {

    static async initPhonepay(dt) {
		try {
			const data = {
				merchantId: config.phonePe.merchantId,
				merchantTransactionId: "656afd7b2ae08801fa3243ae",
				merchantUserId: "656afd7b2ae08801fa3243ae",
				amount: 100,
				redirectUrl: config.phonePe.redirectUrl,
				redirectMode: 'POST',
				callbackUrl: config.phonePe.callbackUrl,
				mobileNumber: "8826648669",
				paymentInstrument: {
					type: 'PAY_PAGE'
				}
			};
			const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
			const finalXHeader = crypto.createHash('sha256').update(encodedData + '/pg/v1/pay' + process.env.PHONEPAY_SALTKEY).digest('hex') + '###' + process.env.PHONEPAY_SALTINDEX;
			let response = {};
			if (dt.getpaymentUrl) {
				response = await axios.post(
					process.env.PHONEPAY_BASEURL + 'pay',
					{ request: encodedData },
					{
						headers: {
							'Content-Type': 'application/json',
							'X-VERIFY': finalXHeader
						}
					}
				);

			}
			return { ...response.data, encodedData, finalXHeader };
		} catch (error) {
			throw error;
		}
	}
}

module.exports = paymentServices;