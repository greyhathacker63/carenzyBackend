const { Types } = require("mongoose");
const dealerLeadModel = require("../models/dealerLead");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class dealerLeadServices {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : ''
            };
            clearSearch(search);


            response.data = await dealerLeadModel.findOne(search);
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                dealerFromId: query.dealerFromId ? Types.ObjectId(query.dealerFromId) : '',
                dealerToId: query.dealerToId ? Types.ObjectId(query.dealerToId) : '',
                dealerCarId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : ''
            };

            clearSearch(search);

            let $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: "dealer_cars",
                        localField: "dealerCarId",
                        foreignField: "_id",
                        as: "dealerCarDetails",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "brand_models",
                                    localField: "modelId",
                                    foreignField: "_id",
                                    as: "brandModelDetails",
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$brandModelDetails" } },
                            {
                                $lookup: {
                                    from: "model_variants",
                                    localField: "variantId",
                                    foreignField: "_id",
                                    as: "modelVariantsDetails",
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$modelVariantsDetails" } },
                            {
                                $project: {
                                    variantName: "$modelVariantsDetails.name",
                                    modelName: "$brandModelDetails.name",
                                    thumbnailImage: 1
                                }
                            },
                        ]
                    }
                },
                { $unwind: { path: "$dealerCarDetails" } },
                {
                    $lookup: {
                        from: "dealers",
                        localField: "dealerFromId",
                        foreignField: "_id",
                        as: "dealerDetails",
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    crz: 1,
                                    dealershipName: 1,
                                    avatar: 1,
                                    phones: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$dealerDetails" } },
                {
                    $project: {
                        _id: 0,
                        carName: { "$concat": ["$dealerCarDetails.modelName", " ", "$dealerCarDetails.variantName"] },
                        carThumbnailImage: { $cond: ["$dealerCarDetails.thumbnailImage", "$dealerCarDetails.thumbnailImage", null] },
                        dealerDealershipName: { $cond: ["$dealerDetails.dealershipName", "$dealerDetails.dealershipName", null] },
                        dealerCrz: { $cond: ["$dealerDetails.crz", "$dealerDetails.crz", null] },
                        dealerAvatar: { $cond: ["$dealerDetails.avatar", "$dealerDetails.avatar", null] },
                        phone: { "$first": "$dealerDetails.phones" },
                        createdAt: 1
                    }
                },
            ];
            response = await paginationAggregate(dealerLeadModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await dealerLeadModel.findById(_id) : new dealerLeadModel();

            docData.dealerFromId = data.dealerFromId;
            docData.dealerToId = data.dealerToId;
            docData.dealerCarId = data.dealerCarId;
            docData.phone = data.phone;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = dealerLeadServices;