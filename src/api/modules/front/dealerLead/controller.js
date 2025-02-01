const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const service = require("../../../../services/dealerCar");
const dealerLeadServices = require('../../../../services/dealerLead');
const dealerLeadModel = require('../../../../models/dealerLead')
const mongoose = require('mongoose')

class Controller {
    static async save(req, res) {
        try {
            const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code };
           
            const dataExistAlready = await dealerLeadModel.findOne({ dealerCarId: req.body.dealerCarId, phone: req.body.phone })
            if (dataExistAlready) {
                return res.json({
                    success: "true",
                    message: "Data is already saved",
                    data: {},
                    code: 200
                })
            }

            const srvRes = await dealerLeadServices.save({ ...req.body, dealerFromId: req.__cuser._id });
            if (srvRes.status) {
                // response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            res.json(err.message)
            // Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
    // static async list(req, res) {
    //     try {
    //         const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
    //         const srvRes = await dealerLeadServices.listFront({ ...req.query, dealerToId11: req.__cuser._id });
    //         if (srvRes.data.length) {
    //             response.data = srvRes.data;
    //             response.message = Message.dataFound.message;
    //             response.code = Message.dataFound.code;
    //         }
    //         response.extra = srvRes.extra;
    //         Response.success(res, response);
    //     } catch (err) {
    //         Response.fail(res, Response.createError(Message.dataFetchingError, err));
    //     }
    // }

    static async list(req, res) {
        try {
            let { dealerFromId, page = 1, limit = 20 } = req.query;
            page = Math.max(1, Number(page));
            limit = Math.max(1, Number(limit));

            if (!dealerFromId) {
                return res.json({
                    status_code: false,
                    message: "Please provide dealerFromId",
                    data: [],
                    total: 0
                });
            }

            const dealerFromIdData = await dealerLeadModel.aggregate([
                {
                    $match: {
                        dealerToId: new mongoose.Types.ObjectId(dealerFromId)
                    }
                },
                {
                    $lookup: {
                        from: "dealer_cars",
                        localField: "dealerCarId",
                        foreignField: "_id",
                        as: "carData",
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'brands',
                                    localField: 'brandId',
                                    foreignField: '_id',
                                    as: 'brandDetail',
                                    pipeline: [
                                        { $project: { _id: 0, name: '$name' } }
                                    ]
                                }
                            },
                            { $unwind: { path: '$brandDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'brand_models',
                                    localField: 'modelId',
                                    foreignField: '_id',
                                    as: 'modelDetails',
                                    pipeline: [
                                        { $project: { _id: 0, name: '$name' } }
                                    ]
                                }
                            },
                            { $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: false } },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetail',
                                    pipeline: [
                                        { $project: { _id: 0, name: '$name' } }
                                    ]
                                }
                            },
                            { $unwind: { path: '$variantDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    _id: 0,
                                    carName: { "$concat": ["$brandDetail.name", " ", "$modelDetails.name", " ", "$variantDetail.name"] },
                                    thumbnailImage: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'dealers',
                        localField: 'dealerToId',
                        foreignField: '_id',
                        as: 'dealerDetail',
                        pipeline: [
                            { $project: { _id: 0, crz: 1, dealershipName: 1, avatar: 1, phones: 1 } }
                        ]
                    }
                },
                { $unwind: { path: '$dealerDetail', preserveNullAndEmptyArrays: true } },
                { $unwind: { path: '$carData', preserveNullAndEmptyArrays: true } },
                {
                    $facet: {
                        paginatedData: [
                            { $sort: { createdAt: -1 } },
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $project: {
                                    _id: 0,
                                    carName: '$carData.carName',
                                    carThumbnailImage: { $cond: ["$carData.thumbnailImage", "$carData.thumbnailImage", null] },
                                    dealerDealershipName: { $cond: ["$dealerDetail.dealershipName", "$dealerDetail.dealershipName", null] },
                                    dealerCrz: { $cond: ["$dealerDetail.crz", "$dealerDetail.crz", null] },
                                    dealerAvatar: { $cond: ["$dealerDetail.avatar", "$dealerDetail.avatar", null] },
                                    phone: { "$first": "$dealerDetail.phones" },
                                    createdAt: 1
                                }
                            }
                        ],
                        total: [{ $count: 'total' }]
                    }
                }
            ]);

            const data = dealerFromIdData[0]?.paginatedData || [];
            const total = dealerFromIdData[0]?.total[0]?.total || 0;

            res.json({
                status_code: true,
                message: "Data fetched successfully",
                data,
                total
            });
        } catch (err) {
            res.json({
                status_code: false,
                message: err.message,
                data: [],
                total: 0
            });
        }
    }
}

module.exports = Controller
