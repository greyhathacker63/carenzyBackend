const { Types } = require("mongoose");
const brandModelLike = require("../models/brandModelLike");
// const { paginationAggregate } = require('../utilities/pagination');
// const { clearSearch } = require("../utilities/Helper")

class brandModelServices {

    static async updateDealerLikes(data) {
        const response = { data: {}, status: false };
        try {
            if (data.type === "add") {
                const docData = await brandModelLike.findOne({ brandModelId: Types.ObjectId(data.brandModelId), dealerId: Types.ObjectId(data.dealerId) }) || new brandModelLike();

                docData.brandModelId = data.brandModelId;
                docData.dealerId = data.dealerId;

                await docData.save();
                response.data = docData;
            } else {
                await brandModelLike.deleteOne({ dealerId: data.dealerId, brandModelId: data.brandModelId });
            }

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async updateDealerLikesMultiple(data) {
        const response = { data: {}, status: false };
        try {
            const inserDatas = [];
            const deleteData = [];
            data.forEach(async (element) => {
                deleteData.push({
                    dealerId: Types.ObjectId(element.dealerId), brandModelId: Types.ObjectId(element.brandModelId)
                });
                if (element.like) {
                    inserDatas.push({
                        dealerId: element.dealerId,
                        brandModelId: element.brandModelId,
                    });
                }
            });
            await brandModelLike.deleteMany({ $or: deleteData });
            await brandModelLike.insertMany(inserDatas);

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = brandModelServices;