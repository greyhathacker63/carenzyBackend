const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const service = require("../../../../services/dealerCar");
const dealerService = require("../../../../services/dealer");
const dealerCarLikeServices = require('../../../../services/dealerCarLike');
const dealerCarMarketPlaceServices = require('../../../../services/dealerCarMarketPlace');
const dealerCarBiddingServices = require('../../../../services/dealerCarBidding');
const firebaseServices = require('../../../../services/firebase');
const dealerCarBookmarkServices = require('../../../../services/dealerCarBookmark');
const biddingLiveServices = require('../../../../services/biddingLive');
const dealerCarOfferServices = require('../../../../services/dealerCarOffer');
const configurationServices = require('../../../../services/configuration');
const brandModelServices = require('../../../../services/brandModel');
const rtoServices = require('../../../../services/rto');
const bidService = require("../../../../services/bidding");
const followService = require("../../../../services/follow");
const { maskSensitiveData } = require("../../../../utilities/Helper");

class Controller {
    static async save(req, res) {
        try {
            const response = { message: Message.badRequest.message, code: Message.badRequest.code };
            console.log(req)
            console.log(req.__cuser)
            console.log(req.__cuser.location)


            const srvRes = await service.save({ ...req.body, locationDealer: req.__cuser.location, dealerId: req.__cuser._id });
            if (srvRes.status) {
                let biddingMinutes = 0;
                // if (req.body.type?.includes('Bidding')) {
                //     try {
                //         console.log("1")
                //         biddingMinutes = (await configurationServices.details({ type: 'Bidding Duration' }))?.data?.value || 0;
                //         console.log("2")

                //         biddingMinutes = biddingMinutes * 1;
                //         console.log("3")

                //     } catch (error) {
                //     }
                //     const { data: liveBiddingDetails } = await biddingLiveServices.save({
                //         dealerCarId: srvRes.data?._id,
                //         startTime: Date.now(),
                //         endTime: Date.now() + biddingMinutes * 60 * 1000,
                //         lastBid: (/* srvRes.data?.askingPrice +  */(srvRes.data?.biddingIncGap || 5000))
                //     });
                //     try {
                //         firebaseServices.newCarInBid({ dealerCarId: srvRes.data?._id, bidId: liveBiddingDetails._id });
                //     } catch (error) {
                //     }
                // } else {
                    const { data: marketPlaceDetails } = await dealerCarMarketPlaceServices.save({ dealerCarId: srvRes.data?._id, startTime: Date.now() + biddingMinutes * 60 * 1000 });

                    // setTimeout(() => {
                    //     try {
                    //         firebaseServices.newCarInMarketPlace({ dealerCarId: srvRes.data?._id, marketPlaceId: marketPlaceDetails._id });
                    //     } catch (error) {
                    //     }
                    // }, biddingMinutes * 60 * 1000);
                // }


                try {
                    configurationServices.updateMarketCarCount();
                } catch (error) {
                }
                response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
    static async delete(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await service.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            try {
                configurationServices.updateMarketCarCount();
            } catch (error) {
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
    static async updateDealerCarBookmark(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await dealerCarBookmarkServices.updateDealerCarBookmark({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = req.body.type === "add" ? "Added to bookmark list" : "Removed from bookmark list";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async updateDealerCarBookmarkMultiple(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await dealerCarBookmarkServices.updateDealerCarBookmarkMultiple([...req.body?.map(v => ({ ...v, dealerId: req.__cuser._id }))]);
            if (srvRes.status) {
                response.message = "Bookmark list updated";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async updateDealerCarLikes(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await dealerCarLikeServices.updateDealerCarLikes({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = req.body.type === "add" ? "You liked this car" : "Removed from your likes";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async updateDealerCarLikesMultiple(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await dealerCarLikeServices.updateDealerCarLikesMultiple([...req.body?.map(v => ({ ...v, dealerId: req.__cuser._id }))]);
            if (srvRes.status) {
                response.message = "Likes list updated";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async makeSold(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await service.makeSold({ ...req.body, _id: req.body.dealerCarId, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = "Status changed to 'Sold' for this car";
                response.code = Message.dataSaved.code;
            }
            try {
                configurationServices.updateMarketCarCount();
            } catch (error) {
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async makeRemoved(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await service.makeRemoved({ ...req.body, _id: req.body.dealerCarId, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = "Car removed";
                response.code = Message.dataSaved.code;
            }
            try {
                configurationServices.updateMarketCarCount();
            } catch (error) {
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async makeInList(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await service.makeInList({ ...req.body, _id: req.body.dealerCarId, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = "Status changed to 'In List' for this car";
                response.code = Message.dataSaved.code;
            }
            try {
                configurationServices.updateMarketCarCount();
            } catch (error) {
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await service.list({
                status: "Sold",
                dealerId: req.query.getOwnCar == "1" ? req.__cuser._id : null,
                ...req.query,
                requestingDealerId: req.__cuser._id,
            });
            if (srvRes.data.length) {
                response.data = (req.__cuser.verifcationStatus && (!req.__cuser.subscriptionExpired)) ? srvRes.data : maskSensitiveData(JSON.parse(JSON.stringify(srvRes.data)));
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async detailsMarketPlace(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const { data: liveMarketPlaceData } = await dealerCarMarketPlaceServices.detailsByMarketPlaceLiveId(req.params._id);
            const srvRes = await dealerCarMarketPlaceServices.details({ _id: liveMarketPlaceData?.dealerCarId || req.params._id, marketPlaceLiveId: req.params._id, type: "Market", dealerId: req.__cuser._id });

            if (srvRes.data?._id) {
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
    static async listMarketPlace(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const search = {
                // type: "Market",
                status: "In List",
                dealerId: req.query.getOwnCar == "1" ? req.__cuser._id : null,
                ...req.query,
                requestingDealerId: req.__cuser._id,
            };
            if (req.query.followingDealerCars == "1") {
                const { data: followingDealers } = await followService.list({ isAll: 1, followerId: req.__cuser._id });
                search.dealerId = followingDealers.map(v => v._id?.toString());
            }
            if (req.query.key) {
                const { data: dealersFound } = await dealerService.listDealer({ key: req.query.key, isAll: 1 });
                search.keyWiseDealerId = [...dealersFound.map(v => v._id.toString())];

                const { data: rtosFound } = await rtoServices.listFront({ isAll: 1, key: req.query.key });
                search.keyWiseRtoId = rtosFound.map(v => v._id.toString());
            }
            if (req.query.stateId) {
                const { data: rtoIds } = await rtoServices.listFront({ isAll: 1, stateId: req.query.stateId });
                search.rtoId = rtoIds.map(v => v._id.toString());
            }
            if (req.query.bodyTypeId) {
                const { data: models } = await brandModelServices.listFront({ isAll: 1, bodyTypeId: req.query.bodyTypeId });
                const modelIds = models.map(v => v._id.toString());
                if (search.modelId) {
                    if (Array.isArray(search.modelId)) {
                        search.modelId = [...search.modelId, ...modelIds];
                    } else {
                        search.modelId = [search.modelId, ...modelIds];
                    }
                } else {
                    search.modelId = modelIds;
                }
            }
            if (req.query.onlyTotal && !Object.keys(req.query).find(v => !(['page', 'total', 'onlyTotal', 'limit'].includes(v)))) {
                response.extra = {
                    total: (await configurationServices.details({ type: 'Market Car Count' })).data.value * 1 || 0,
                    page: 0,
                    limit: 0
                }
                const { data: { value } } = await configurationServices.details({ type: 'Add Extra Number In Market Car Count' });
                response.extra.total = response.extra.total + ((value * 1) || 0);
            } else {
                const srvRes = await dealerCarMarketPlaceServices.list(search);
                if (srvRes.data.length) {
                    response.data = (req.__cuser.verifcationStatus && (!req.__cuser.subscriptionExpired)) ? srvRes.data : maskSensitiveData(JSON.parse(JSON.stringify(srvRes.data)));
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
    static async makeOffer(req, res) {
        try {
            const response = { message: Message.badRequest.message, code: Message.badRequest.code };
            const srvRes = await dealerCarOfferServices.save({ ...req.body, dealerId: req.__cuser._id });
            try {
                firebaseServices.newOfferFromDealer({
                    dealerId: req.body.ownerDealerId,
                    offerDetails: JSON.parse(JSON.stringify(srvRes.data))
                });
            } catch (error) {
            }
            if (srvRes.status) {
                response.data = null;// srvRes.data;
                response.message = "Offer placed successfully";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
    static async listOffers(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await dealerCarOfferServices.list({ ...req.query, /* dealerId: req.__cuser._id */ });
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

    static async listLiveBid(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const search = {
                status: "In List",
                dealerId: req.query.getOwnCar == "1" ? req.__cuser._id : null,
                ...req.query,
                requestingDealerId: req.__cuser._id,
                endTime: new Date(),
            };
            if (req.query.followingDealerCars == "1") {
                const { data: followingDealers } = await followService.list({ isAll: 1, followerId: req.__cuser._id });
                search.dealerId = followingDealers.map(v => v._id?.toString());
            }
            if (req.query.stateId) {
                const { data: rtoIds } = await rtoServices.listFront({ isAll: 1, stateId: req.query.stateId });
                search.rtoId = rtoIds.map(v => v._id.toString());
            }
            const srvRes = await biddingLiveServices.listLive(search);
            if (srvRes.data.length) {
                response.data = (req.__cuser.verifcationStatus && (!req.__cuser.subscriptionExpired)) ? srvRes.data : maskSensitiveData(JSON.parse(JSON.stringify(srvRes.data)));
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }
            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async detailsLiveBid(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const { data: liveBidData } = await biddingLiveServices.detailsByBiddingId(req.params._id);
            const srvRes = await dealerCarMarketPlaceServices.details({ ...req.query, _id: liveBidData.dealerCarId, liveBiddingId: req.params._id, type: "Bidding", dealerId: req.__cuser._id });

            if (srvRes.data?._id) {
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


    // Make Bid Controller
    static async makeBidDetails(req, res) {
        try {
            const response = { data: {}, message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await bidService.details(req.params._id);

            if (srvRes.data?._id) {
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
    static async makeBidList(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await bidService.listFront({ ...req.query, liveBiddingId: req.query.bidId, /* dealerId: req.__cuser._id */ });
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
    static async makeBidSave(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await bidService.save({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                await biddingLiveServices.updateLastBid({ dealerCarId: req.body.dealerCarId, lastBid: req.body.bidAmount });
                global.socketEmitter.emit('new-bid', req.body.bidId, {
                    resCode: Message.dataFound.code,
                    message: "New bid of bidid " + req.body.bidId,
                    bidAmount: req.body.bidAmount,
                    status: true
                });
                try {
                    firebaseServices.newBidFromDealer({
                        dealerId: req.body.ownerDealerId,
                        biddingDetails: JSON.parse(JSON.stringify(srvRes.data))
                    });
                } catch (error) {
                }
                response.data = null;
                response.message = Message.bidPlaced.message;
                response.code = Message.bidPlaced.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }

    static async bidDelete(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await bidService.delete({ bidId: req.body.bidId });
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            console.log(err)
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }

    static async saveDealerCarKeys(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await dealerCarMarketPlaceServices.saveDealerCarKeys();
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

    // Distinct location
    static async listDistinctLocation(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await service.listDistinctLocation({ ...req.query });
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
}

module.exports = Controller
