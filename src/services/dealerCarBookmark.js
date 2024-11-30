const { Types } = require("mongoose");
const dealerCarBookmarkModel = require("../models/dealerCarBookmark");

class dealerCarBookmarkServices {
    static async updateDealerCarBookmark(data) {
        const response = { data: {}, status: false };
        try {
            if (data.type === "add") {
                const docData = await dealerCarBookmarkModel.findOne({ dealerCarId: Types.ObjectId(data.dealerCarId), dealerCarId: Types.ObjectId(data.dealerCarId) }) || new dealerCarBookmarkModel();

                docData.dealerCarId = data.dealerCarId;
                docData.dealerId = data.dealerId;

                await docData.save();

                response.data = docData;
            } else {
                await dealerCarBookmarkModel.deleteOne({ dealerId: data.dealerId, dealerCarId: data.dealerCarId });
            }

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async updateDealerCarBookmarkMultiple(data) {
        const response = { data: {}, status: false };
        try {
            const inserDatas = [];
            const deleteData = [];
            data.forEach(async (element) => {
                deleteData.push({
                    dealerId: Types.ObjectId(element.dealerId), dealerCarId: Types.ObjectId(element.dealerCarId)
                });
                if (element.bookmark) {
                    inserDatas.push({
                        dealerId: element.dealerId,
                        dealerCarId: element.dealerCarId,
                    });
                }
            });
            await dealerCarBookmarkModel.deleteMany({ $or: deleteData });
            await dealerCarBookmarkModel.insertMany(inserDatas);

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = dealerCarBookmarkServices;