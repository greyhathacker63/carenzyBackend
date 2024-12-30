const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const Services = require('../../../../services/rto');
const RTOModel = require('../../../../models/rto')
const state = require('../../../../models/state')


class Controller {
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await Services.listFront({ ...req.query, forFront: true });
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
    static async lists(req, res) {
        try {
            const { page = 1, limit = 20, isAll, state_name } = req.query;
            const search = { isDeleted: false };
            const extra = { page: parseInt(page, 10) };
            if (state_name) {
                search.name = state_name
            }
            if (isAll) {
                const stateDetails = await state.aggregate([
                    {
                        $match: search
                    },
                    {
                        $lookup: {
                            from: "rtos",
                            localField: "_id",
                            foreignField: "stateId",
                            as: "rtosDetails",
                            pipeline: [
                                { $match: { isDeleted: false } },
                                { $project: { _id: 0, name: 1, code: 1 } }
                            ]
                        }
                    },
                    {
                        $project: {
                            state_name: "$name",
                            state_code: "$code",
                            rtosDetails: 1
                        }
                    }
                ]);

                extra.total = stateDetails.length;
                extra.limit = stateDetails.length;

                return res.json({
                    status_code: true,
                    data: stateDetails,
                    code: 200,
                    extra
                });
            }

            const stateDetails = await state.aggregate([
                {
                    $match: search
                },
                {
                    $lookup: {
                        from: "rtos",
                        localField: "_id",
                        foreignField: "stateId",
                        as: "rtosDetails",
                        pipeline: [
                            { $match: { isDeleted: false } },
                            { $project: { _id: 0, name: 1, code: 1 } }
                        ]
                    }
                },
                {
                    $project: {
                        state_name: "$name",
                        state_code: "$code",
                        rtosDetails: 1
                    }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: parseInt(limit, 10)
                }
            ]);

            const total = await state.countDocuments(search);
            extra.total = total;
            extra.limit = Math.min(limit, total - (page - 1) * limit);

            return res.json({
                status_code: true,
                data: stateDetails,
                code: 200,
                extra
            });
        } catch (err) {
            return res.json({
                status_code: false,
                data: [],
                code: 500,
                extra: {}
            });
        }
    }


}

module.exports = Controller