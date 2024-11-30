const { Types } = require("mongoose");
const bidding = require("../models/bidding");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");
const biddingLiveServices = require("./biddingLive");

class biddingServices {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await bidding.findOne({
                _id,
            })
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
            ];
            response = await paginationAggregate(bidding, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listAdmin(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                dealerId: query.dealerId && query.ignoreDealerId === undefined ? Types.ObjectId(query.dealerId) : '',
                dealerCarId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : '',
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: "dealers",
                        localField: "dealerId",
                        foreignField: "_id",
                        as: "dealerDetails",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "states",
                                    localField: "stateId",
                                    foreignField: "_id",
                                    as: "stateDetails",
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1,
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    name: 1,
                                    avatar: 1,
                                    location: "$stateDetails.name"
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$dealerDetails", preserveNullAndEmptyArrays: false } },
                {
                    $project: {
                        bidAmount: 1,
                        dealerDetails: 1,
                    }
                }
            ];


            response = await paginationAggregate(bidding, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                liveBiddingId: query.liveBiddingId ? Array.isArray(query.liveBiddingId) ? { $in: query.liveBiddingId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.liveBiddingId) : '',
                dealerId: query.dealerId && query.ignoreDealerId === undefined ? Types.ObjectId(query.dealerId) : '',
                dealerCarId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: "dealers",
                        localField: "dealerId",
                        foreignField: "_id",
                        as: "dealerDetails",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "states",
                                    localField: "stateId",
                                    foreignField: "_id",
                                    as: "stateDetails",
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1,
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    name: { $cond: ["$name", "$name", "Carenzy user"] },
                                    avatar: { $cond: ["$avatar", "$avatar", ""] },
                                    location: { $cond: ["$stateDetails.name", "$stateDetails.name", "India"] },
                                    phone: { $first: "$phones" }
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$dealerDetails", preserveNullAndEmptyArrays: false } },
                {
                    $project: {
                        bidAmount: 1,
                        dealerDetails: 1,
                    }
                }
            ];


            response = await paginationAggregate(bidding, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async save(data) {
        const response = { data: {}, status: false };
        try {
            const docData = new bidding();
            docData.liveBiddingId = data.liveBiddingId;
            docData.dealerCarId = data.dealerCarId;
            docData.dealerId = data.dealerId;
            docData.bidAmount = data.bidAmount;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async delete({ bidId }) {
        const response = { status: false, ids: [] };
        try {
            const bidData = await bidding.findOne({ _id: Types.ObjectId(bidId), isDeleted: false })
            if (Array.isArray(bidId)) {
                await bidding.updateMany({ $or: [{ _id: { $in: bidId } }] }, { isDeleted: true })

            }
            else if (typeof bidId === "string") {
                await bidding.updateOne({ _id: bidId }, { isDeleted: true });
                response.id = bidId
            }

            // to update to the highest bid:
            const highestBid = (await biddingLiveServices.getHighestBid(bidData?.dealerCarId))?.data.bidAmount || 0;
            await biddingLiveServices.updateLastBid({ dealerCarId: bidData?.dealerCarId, lastBid: highestBid });

            response.status = true;
            response.id = bidId

            return response;
        } catch (error) {
            throw error;
        }

    }
}

module.exports = biddingServices;