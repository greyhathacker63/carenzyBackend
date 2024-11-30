const { Types } = require("mongoose");
const brandModelBookmark = require("../models/brandModelBookmark");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class brandModelServices {
    static async updateDealerBookmark(data) {
        const response = { data: {}, status: false };
        try {
            if (data.type === "add") {
                const docData = await brandModelBookmark.findOne({ brandModelId: Types.ObjectId(data.brandModelId), dealerId: Types.ObjectId(data.dealerId) }) || new brandModelBookmark();

                docData.brandModelId = data.brandModelId;
                docData.dealerId = data.dealerId;

                await docData.save();

                response.data = docData;
            } else {
                await brandModelBookmark.deleteOne({ dealerId: data.dealerId, brandModelId: data.brandModelId });
            }

            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async updateDealerBookmarkMultiple(data) {
        const response = { data: {}, status: false };
        try {
            const inserDatas = [];
            const deleteData = [];
            data.forEach(async (element) => {
                deleteData.push({
                    dealerId: Types.ObjectId(element.dealerId), brandModelId: Types.ObjectId(element.brandModelId)
                });
                if (element.bookmark) {
                    inserDatas.push({
                        dealerId: element.dealerId,
                        brandModelId: element.brandModelId,
                    });
                }
            });
            await brandModelBookmark.deleteMany({ $or: deleteData });
            await brandModelBookmark.insertMany(inserDatas);
             response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listBookmarks(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                dealerId: query.dealerId ? Array.isArray(query.dealerId) ? { $in: query.dealerId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
            };

            clearSearch(search);


            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        brandModelId: 1,
                        dealerId: 1
                    }
                }
            ];
            response = await paginationAggregate(brandModelBookmark, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = brandModelServices;