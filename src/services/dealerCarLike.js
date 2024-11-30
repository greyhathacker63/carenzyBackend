const { Types } = require("mongoose");
const dealerCarLike = require("../models/dealerCarLike");
const biddingLiveModel = require("../models/bidding_live");
// const { paginationAggregate } = require('../utilities/pagination');
// const { clearSearch } = require("../utilities/Helper")

class dealerCarLikeServices {

    static async updateDealerCarLikes(data) {
        const response = { data: {}, status: false };
        try {
            if (data.type === "add") {
                const docData = await dealerCarLike.findOne({ dealerCarId: Types.ObjectId(data.dealerCarId), dealerId: Types.ObjectId(data.dealerId) }) || new dealerCarLike();

                docData.dealerCarId = data.dealerCarId;
                docData.dealerId = data.dealerId;

                await docData.save();
                response.data = docData;
            } else {
                await dealerCarLike.deleteOne({ dealerId: data.dealerId, dealerCarId: data.dealerCarId });
            }

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async updateDealerCarLikesMultiple(data) {
        const response = { data: {}, status: false };
        try {
            const inserDatas = [];
            const deleteData = [];
            data.forEach(async (element) => {
                deleteData.push({
                    dealerId: Types.ObjectId(element.dealerId), dealerCarId: Types.ObjectId(element.dealerCarId)
                });
                if (element.like) {
                    inserDatas.push({
                        dealerId: element.dealerId,
                        dealerCarId: element.dealerCarId,
                    });
                }
            });
            await dealerCarLike.deleteMany({ $or: deleteData });
            await dealerCarLike.insertMany(inserDatas);

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = dealerCarLikeServices;