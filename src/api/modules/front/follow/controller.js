const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const followService = require("../../../../services/follow");
const follows = require('../../../../models/follow')
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { update } = require('lodash');
const { modelName } = require('../../../../models/file');

class brandController {

    static async details(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await followService.details(req.__cuser._id);

            if (srvRes.data.length) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            if (req.query.following == 1 || req.query.following == 0) {
                const srvRes = await followService.list({
                    ...req.body,
                    followerId: req.query.following == 1 ? req.__cuser._id : null,
                    followingId: req.query.following == 0 ? req.__cuser._id : null,
                });
                if (srvRes.data.length) {
                    response.data = srvRes.data;
                    response.message = Message.dataFound.message;
                    response.code = Message.dataFound.code;
                }
                response.extra = srvRes.extra;
            }

            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }

    static async list2(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({
                    status_code: false,
                    message: errors.array(),
                    total: 0,
                    data: []
                });
            }

            let { _id, limit = 20, page = 1 } = req.query;

            if (!_id) {
                return res.json({
                    status_code: false,
                    message: "Please provide _id",
                    data: [],
                    total: 0
                });
            }
            limit = Math.max(1, Number(limit))
            page = Math.max(1, Number(page))

            const followerId = new mongoose.Types.ObjectId(_id);

            const dealerCarDetail = await follows.aggregate([
                {
                    $match: {
                        followerId: followerId,
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'dealer_cars',
                        foreignField: 'dealerId',
                        localField: 'followingId',
                        as: "carData",
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'brand_models',
                                    localField: 'modelId',
                                    foreignField: '_id',
                                    as: 'modelDetails',
                                    pipeline: [
                                        {
                                            $project: {
                                                _id: 0,
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: false } },
                            {
                                $lookup: {
                                    from: 'brands',
                                    localField: 'brandId',
                                    foreignField: '_id',
                                    as: 'brandDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                _id: 0,
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$brandDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                _id: 0,
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$variantDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'fuel_types',
                                    localField: 'fuelTypeId',
                                    foreignField: '_id',
                                    as: 'fuelTypes',
                                    pipeline: [
                                        {
                                            $project: {
                                                _id: 0,
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $unwind: {
                                    path: '$fuelTypes',
                                    preserveNullAndEmptyArrays: true
                                }
                            },

                            {
                                $lookup: {
                                    from: 'rtos',
                                    localField: 'rtoId',
                                    foreignField: '_id',
                                    as: 'rtodetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                _id: 0,
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $unwind: {
                                    path: '$rtodetail',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'states',
                                    localField: 'stateId',
                                    foreignField: '_id',
                                    as: 'statedetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                _id: 0,
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $unwind: {
                                    path: '$statedetail',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'dealers',
                                    localField: 'dealerId',
                                    foreignField: '_id',
                                    as: 'dealerDetail',
                                }
                            },
                            {
                                $unwind: {
                                    path: '$dealerDetail',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $sort: { updatedAt: -1 }
                            },
                            {
                                $limit: 1
                            },
                            {
                                $project: {
                                    dealer_phones: '$dealerDetail.phones',
                                    dealer_termAccepted: "$dealerDetail.termAccepted",
                                    dealer_status: '$dealerDetail.status',
                                    dealer_verificationStatus: "$dealerDetail.verifcationStatus",
                                    dealer_isDeleted: "$dealerDetail.dealer_isDeletedfalse",
                                    dealer_aadhaarNo: "$dealerDetail.aadhaarNo",
                                    dealer_address: "$dealerDetail.dealer_address",
                                    dealer_adharBackImgUrl: "$dealerDetail.adharBackImgUrl",
                                    dealer_adharFrontImgUrl: "$dealerDetail.adharFrontImgUrl",
                                    dealer_dealershipName: "$dealerDetail.dealershipName",
                                    dealer_email: "$dealerDetail.email",
                                    dealer_name: "$dealerDetail.name",
                                    dealer_panCardimgUrl: "$dealerDetail.panCardimgUrl",
                                    dealer_panNo: "$dealerDetail.panNo",
                                    dealer_pinCode: "$dealerDetail.pinCode",
                                    dealer_registrationCertificateId: "$dealerDetail.registrationCertificateId",
                                    dealer_rtoId: "$dealerDetail.rtoId",
                                    dealer_shopPhotoUrl: "$dealerDetail.shopPhotoUrl",
                                    dealer_avatar: "$dealerDetail.avatar",
                                    dealer_crz: "$dealerDetail.crz",
                                    dealer_gstImgUrl: "$dealerDetail.gstImgUrl",
                                    dealer_registrationCertImgUrl: "$dealerDetail.registrationCertImgUrl",
                                    dealer_stateId: "$dealerDetail.stateId",
                                    dealer_location: "$dealerDetail.location",
                                    dealer_carAllowedIn: "$dealerDetail.carAllowedIn",
                                    dealer_lastBidNotificationId: "$dealerDetail.lastBidNotificationId",
                                    dealer_lastGeneralNotificationId: "$dealerDetail.lastGeneralNotificationId",
                                    brandName: "$brandDetail.name",
                                    variantName: "$variantDetail.name",
                                    fuelName: "$fuelTypes.name",
                                    rtoName: "$rtodetail.name",
                                    stateName: "$statedetail.name",
                                    underHypothecation: 1,
                                    isDeleted: 1,
                                    bonusNotClaimed: 1,
                                    bonusNotClaimedPercentage: 1,
                                    transmissionType: 1,
                                    keys: 1,
                                    interiorImageVideos: 1,
                                    exteriorImageVideos: 1,
                                    engineImageVideos: 1,
                                    status: 1,
                                    approved: 1,
                                    isDeleted: 1,
                                    dealerId: 1,
                                    modifiedPrice: 1,
                                    askingPrice: 1,
                                    brandId: 1,
                                    modelId: 1,
                                    insuranceDate: 1,
                                    year: 1,
                                    kmsDriven: 1,
                                    numberOfOwners: 1,
                                    thumbnailImage: 1,
                                    reportDescription: 1
                                }
                            },
                        ]
                    }
                },
                {
                    $unwind: '$carData'
                },
                {
                    $facet: {
                        paginatedData: [
                            {
                                $sort: { updatedAt: -1 }
                            },
                            {
                                $skip: (page - 1) * limit
                            }, {
                                $limit: limit
                            },
                            {
                                $project: {
                                    isDeleted: 1,
                                    followerId: 1,
                                    followingId:1,
                                    dealer_phones: '$carData.dealer_phones',
                                    dealer_termAccepted: "$carData.dealer_termAccepted",
                                    dealer_status: '$carData.dealer_status',
                                    dealer_verificationStatus: "$carData.dealer_verificationStatus",
                                    dealer_isDeleted: "$carData.dealer_isDeleted",
                                    dealer_aadhaarNo: "$carData.dealer_aadhaarNo",
                                    dealer_address: "$carData.dealer_address",
                                    dealer_adharBackImgUrl: "$carData.dealer_adharBackImgUrl",
                                    dealer_adharFrontImgUrl: "$carData.dealer_adharFrontImgUrl",
                                    dealer_dealershipName: "$carData.dealer_dealershipName",
                                    dealer_email: "$carData.dealer_email",
                                    dealer_name: "$carData.dealer_name",
                                    dealer_panCardimgUrl: "$carData.dealer_panCardimgUrl",
                                    dealer_panNo: "$carData.dealer_panNo",
                                    dealer_pinCode: "$carData.dealer_pinCode",
                                    dealer_registrationCertificateId: "$carData.dealer_registrationCertificateId",
                                    dealer_rtoId: "$carData.dealer_rtoId",
                                    dealer_shopPhotoUrl: "$carData.dealer_shopPhotoUrl",
                                    dealer_avatar: "$carData.dealer_avatar",
                                    dealer_crz: "$carData.dealer_crz",
                                    dealer_gstImgUrl: "$carData.dealer_gstImgUrl",
                                    dealer_registrationCertImgUrl: "$carData.dealer_registrationCertImgUrl",
                                    dealer_stateId: "$carData.dealer_stateId",
                                    dealer_location: "$carData.dealer_location",
                                    dealer_carAllowedIn: "$carData.dealer_carAllowedIn",
                                    dealer_lastBidNotificationId: "$carData.dealer_lastBidNotificationId",
                                    dealer_lastGeneralNotificationId: "$carData.dealer_lastGeneralNotificationId",
                                    brandName: "$carData.brandName",
                                    variantName: "$carData.variantName",
                                    fuelName: "$carData.fuelName",
                                    rtoName: "$carData.rtoName",
                                    stateName: "$carData.stateName",
                                    underHypothecation:"$carData.underHypothecation",
                                    bonusNotClaimed:"$carData.bonusNotClaimed",
                                    bonusNotClaimedPercentage:"$carData.bonusNotClaimedPercentage",
                                    transmissionType:"$carData.transmissionType",
                                    keys:"$carData.keys",
                                    interiorImageVideos:"$carData.interiorImageVideos",
                                    exteriorImageVideos:"$carData.exteriorImageVideos",
                                    engineImageVideos:"$carData.engineImageVideos",
                                    status:"$carData.status",
                                    approved:"$carData.approved",
                                    dealerId:"$carData.dealerId",
                                    modifiedPrice:"$carData.modifiedPrice",
                                    askingPrice:"$carData.askingPrice",
                                    brandId:"$carData.brandId",
                                    modelId:"$carData.modelId",
                                    insuranceDate:"$carData.insuranceDate",
                                    year:"$carData.year",
                                    kmsDriven:"$carData.kmsDriven",
                                    numberOfOwners:"$carData.numberOfOwners",
                                    thumbnailImage:"$carData.thumbnailImage",
                                    reportDescription:"$carData.reportDescription"
                                }
                            },
                        ],
                        total: [
                            {
                                $count: 'total'
                            }
                        ]
                    }
                }
            ]);
            const data = dealerCarDetail[0]?.paginatedData || []
            const entries = dealerCarDetail[0]?.total[0]?.total || 0

            res.json({
                status_code: true,
                message: "Data fetched successfully",
                data: data,
                total: entries
            });

        } catch (error) {
            res.json({
                status_code: false,
                message: error.message,
                data: [],
                total: 0
            });
        }
    }







    static async count(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await followService.count({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async save(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await followService.save({ ...req.body, followerId: req.__cuser._id });
            if (srvRes.status) {
                // response.data = srvRes.data;
                response.message = "You started following the dealer";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async remove(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await followService.delete({ ...req.body, followerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = "Unfollowed the dealer";
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
}

module.exports = brandController;