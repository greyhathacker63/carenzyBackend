
const { Types } = require('mongoose');
const testimonialModel = require('../models/testimonial');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');


class MasterService {


    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                type: query.type,
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { updatedAt: -1 } },
                {
                    $project: {
                        userId: 1,
                        type: 1,
                        url: 1,
                        description: 1,
                        isDeleted: 1,
                        thumbnail: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                {
                    $lookup: {
                        from: 'dealers',
                        localField: 'userId',
                        foreignField: "_id",
                        as: "dealerData",
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    name: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: '$dealerData',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        userId: '$dealerData.name',
                        type: 1,
                        url: 1,
                        description: 1,
                        isDeleted: 1,
                        thumbnail: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ];

            response = await paginationAggregate(testimonialModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }

    }


}


module.exports = MasterService;