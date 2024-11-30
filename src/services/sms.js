const axios = require('axios');
const config = require('../config');
// const settingModel = require('../models/settings');

class MasterService {
    static dealerLoginTemplate = "Your OTP for Mobile Verification is: ? Please use this code to proceed. CARENZY GLOBAL";
    static async send(type, data) {
        try {

            const response = { data: {}, status: false };
            if (type === "dealer-login-otp") {
                response.data = await this.dealetLoginOtp(data);
            }

            return response;

        } catch (e) {
            throw e;
        }
    }

    static async dealetLoginOtp(data) {
        const message = this.dealerLoginTemplate.replace("?", data.otp);
        const response = { data: { message } };

        try {
            await axios.get(config.smsApi.url,
                {
                    params: {
                        apikey: config.smsApi.apikey,
                        senderid: config.smsApi.senderId,
                        number: data.phone,
                        message: message
                    }
                }
            )
            return response;

        } catch (e) {
            throw new Error("Error while sending otp");
        }
    }
}

module.exports = MasterService;