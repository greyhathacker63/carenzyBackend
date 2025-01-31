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
            const srvRes = await dealerLeadServices.save({ ...req.body, dealerFromId: req.__cuser._id });
            if (srvRes.status) {
                // response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
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
                        dealerFromId: new mongoose.Types.ObjectId(dealerFromId)
                    }
                },
                {
                    $lookup: {
                        from: "dealer_cars",
                        localField: "dealerCarId",
                        foreignField: "_id",
                        as: "carData",
                       
                    }
                },
                {
                    $unwind: {
                        path: '$carData',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $facet: {
                        paginatedData: [
                            {
                                $sort: {
                                    createdAt: -1
                                }
                            },
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $project: {
                                    dealerFromId: 1,
                                    dealerToId: 1,
                                    dealerCarId: 1,
                                    phone: 1,
                                    createdAt: 1,
                                    updatedAt: 1,
                                    underHypothecation: "$carData.underHypothecation",
                                    bonusNotClaimed: "$carData.bonusNotClaimed",
                                    bonusNotClaimedPercentage: "$carData.bonusNotClaimedPercentage",
                                    transmissionType: "$carData.transmissionType",
                                    keys: "$carData.keys",
                                    interiorImageVideos: "$carData.interiorImageVideos",
                                    exteriorImageVideos: "$carData.exteriorImageVideos",
                                    engineImageVideos: "$carData.engineImageVideos",
                                    status: "$carData.status",
                                    approved: "$carData.approved",
                                    isDeleted: "$carData.isDeleted",
                                    dealerId: "$carData.dealerId",
                                    modifiedPrice: "$carData.modifiedPrice",
                                    askingPrice: "$carData.askingPrice",
                                    brandId: "$carData.brandId",
                                    modelId: "$carData.modelId",
                                    insuranceDate: "$carData.insuranceDate",
                                    variantId: "$carData.variantId",
                                    year: "$carData.year",
                                    kmsDriven: "$carData.kmsDriven",
                                    fuelTypeId: "$carData.fuelTypeId",
                                    rtoId: "$carData.rtoId",
                                    stateId: "$carData.stateId",
                                    numberOfOwners: "$carData.numberOfOwners",
                                    thumbnailImage: "$carData.thumbnailImage",
                                    insuranceType: "$carData.insuranceType",
                                    reportDescription: "$carData.reportDescription"
                                }
                            },
                        ],
                        total: [
                            { $count: 'total' }
                        ]
                    }
                }
            ]);

            const data = dealerFromIdData[0]?.paginatedData || [];
            const total = dealerFromIdData[0]?.total[0]?.total || 0;

            res.json({
                status_code: true,
                message: "Data fetched successfully",
                data: data,
                total: total
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
