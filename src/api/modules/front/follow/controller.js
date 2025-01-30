const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const followService = require("../../../../services/follow");
const follows = require('../../../../models/follow')
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { update } = require('lodash');

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
                        localField: 'followerId',
                        as: "carData",
                        pipeline: [
                            {
                                $sort: { updatedAt: -1 }
                            },
                            {
                                $limit: 1
                            }
                        ]
                    }
                },
                {
                    $unwind: '$carData'
                },
                {
                    $facet: {
                        paginatedData :[
                            {
                                $sort: { updatedAt: -1 }
                            },
                            {
                                $skip: (page - 1) * limit
                            }, {
                                $limit: limit
                            }
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