const { Types } = require('mongoose');
const notificationModel = require('../models/notification');
const dealerModel = require('../models/dealer');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');

class notificationService {
    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                dealerCarId: query.dealerCarId ? Types.ObjectId(query.dealerCarId) : '',
                marketPlaceId: query.marketPlaceId ? Types.ObjectId(query.marketPlaceId) : '',
                biddingLiveId: query.biddingLiveId ? Types.ObjectId(query.biddingLiveId) : '',
                offerId: query.offerId ? Types.ObjectId(query.offerId) : '',
                biddingId: query.biddingId ? Types.ObjectId(query.biddingId) : '',
                type: query.type ? Array.isArray(query.type) ? { $in: query.type } : query.type : ''
            };
            if (query.lastId) {
                search._id = { $gt: Types.ObjectId(query.lastId) };
            }

            clearSearch(search);
            if (query.dealerId) {
                search.$or = [
                    { dealerId: Types.ObjectId(query.dealerId) },
                    { dealerId: null }
                ]
            }

            const $aggregate = [
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
                                $project: {
                                    thumbnailImage: "$thumbnailImage",
                                },
                            },
                        ],
                    },
                },
                { $unwind: { path: "$dealerCarDetails", preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: 'bidding_lives',
                        localField: 'biddingLiveId',
                        foreignField: '_id',
                        as: 'biddingLivesDetails',
                        pipeline: [
                            {
                                $project: {
                                    endTime: '$endTime',
                                    lastBid: '$lastBid'
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: '$biddingLivesDetails', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        dealerId: { $cond: ['$dealerId', '$dealerId', null] },
                        fromDealerId: { $cond: ['$fromDealerId', '$fromDealerId', null] },
                        dealerCarId: { $cond: ['$dealerCarId', '$dealerCarId', null] },
                        marketPlaceId: { $cond: ['$marketPlaceId', '$marketPlaceId', null] },
                        biddingLiveId: { $cond: ['$biddingLiveId', '$biddingLiveId', null] },
                        offerId: { $cond: ['$offerId', '$offerId', null] },
                        biddingId: { $cond: ['$biddingId', '$biddingId', null] },
                        title: { $cond: ['$title', '$title', null] },
                        description: { $cond: ['$description', '$description', null] },
                        type: { $cond: ['$type', '$type', null] },
                        thumbnail: { $cond: ["$dealerCarDetails.thumbnailImage", "$dealerCarDetails.thumbnailImage", null] },
                        biddingEndTimeIos: { $cond: ['$biddingLivesDetails.endTime', '$biddingLivesDetails.endTime', null] },
                        biddingLastBid: { $cond: ['$biddingLivesDetails.lastBid', '$biddingLivesDetails.lastBid', null] },
                        biddingEndTime: { $cond: ['$biddingLivesDetails.endTime', { $add: ["$biddingLivesDetails.endTime", 19800000] }, null] },
                        isRead: 1
                    }
                }
            ];

            response = await paginationAggregate(notificationModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async save(data) {
        const response = { data: null, status: false };

        try {
            const docData = data._id ? await notificationModel.findById(data._id) : new notificationModel();

            docData.dealerId = data.dealerId;
            docData.fromDealerId = data.fromDealerId;
            docData.dealerCarId = data.dealerCarId;
            docData.marketPlaceId = data.marketPlaceId;
            docData.biddingLiveId = data.biddingLiveId;
            docData.offerId = data.offerId;
            docData.biddingId = data.biddingId;
            docData.title = data.title;
            docData.description = data.description;
            docData.type = data.type;
            await docData.save();

            response.data = docData;
            response.status = true;

            return response;

        } catch (err) {
            throw err;
        }
    }
    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await notificationModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })
            }
            else if (typeof ids === "string") {
                await notificationModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }
    static async clearNotification(data) {
        const response = { data: null, status: false };

        try {
            const docData = await dealerModel.findById(data.dealerId);

            if (data.type == 'General') {
                const { data: [lastNotification] } = await this.listFront({ limit: 1, dealerId: data.dealerId, type: ['General', 'Car In Bidding', 'Car In Market'] })
                docData.lastGeneralNotificationId = lastNotification._id;
            } else {
                const { data: [lastNotification] } = await this.listFront({ limit: 1, dealerId: data.dealerId, type: ['Market Offer Received', 'Bidding Offer Received'] })
                docData.lastBidNotificationId = lastNotification._id;
            }
            await docData.save();

            response.data = docData;
            response.status = true;

            return response;

        } catch (err) {
            throw err;
        }
    }
}

module.exports = notificationService;