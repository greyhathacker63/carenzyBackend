const { Types } = require("mongoose");
const dealerCarModel = require("../models/dealerCar");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const marketPlaceLiveModel = require("../models/marketPlaceLive");

class dealerCarModelServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
    
        try {
            const $match = {
                $and: [
                    { isDeleted: false },
                    {
                        $or: [
                            { 'dealerDetails.name': new RegExp(query.key, 'i') },
                            { 'brandDetail.name': new RegExp(query.key, 'i') }
                        ]
                    }
                ]
            };
            
            const $aggregate = [
                {
                    $lookup: {
                        from: "dealers",
                        // localField: "dealerId",
                        // foreignField: "_id",
                        as: "dealerDetails",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brandDetail',
                        pipeline: [
                            {
                                $project: {
                                    name: '$name',
                                }
                            }
                        ]
                    }
                },
                { $match },
            
                {
                    $project: {
                        dealerCarId: "$_id",
                        brandDetail: { $arrayElemAt: ["$brandDetail", 0] },
                        dealerDetails: { $arrayElemAt: ["$dealerDetails", 0] }
                    }
                },
            ];
            
            response.data = await dealerCarModel.aggregate($aggregate);
            response.status = true;
            return response;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    

}

module.exports = dealerCarModelServices;
