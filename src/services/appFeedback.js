const appFeedbackModel = require("../models/appFeedback");
const ejs = require('ejs');
const path = require('path');
class ServiceServices {
    static async feedbackForm(_id) {
        return await ejs.renderFile(path.join(__dirname, '../views', 'feedback.html'));
    }

    static async feedbackFormKeyenzy(_id) {
        return await ejs.renderFile(path.join(__dirname, '../views', 'feedback-keyenzy.html'));
    }

    static async saveFeedback(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await appFeedbackModel.findById(_id) : new appFeedbackModel();
            docData.name = data?.name;
            docData.phone = data?.phone;
            docData.email = data?.email;
            docData.message = data?.message;


            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ServiceServices