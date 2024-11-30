const admin = require("firebase-admin");
const firebaseDealerAppCredential = require("../config/firebase-dealer-app");
const dealerFcmTokenService = require("./dealerFcmToken");
const dealerCarMarketPlaceServices = require('./dealerCarMarketPlace');
const dealerServices = require('./dealer');
const notificationServices = require('./notification');
const { chunkArray } = require('../utilities/Helper');

admin.initializeApp({ credential: admin.credential.cert(firebaseDealerAppCredential) });

class notificationUserService {
    static async pushNotification({ dealerId = null, title, body, image = null, data = null }) {
        const response = { data: {}, status: false };

        try {
            const { data: fcmTokenList } = await dealerFcmTokenService.list({ dealerId, isAll: 1 });
            if (data) {
                data = JSON.parse(JSON.stringify(data));
            }

            const messageNotification = {
                notification: {
                    title: title,
                    body: body,
                },
                data: data
            };
            if (image) {
                messageNotification.notification.image = image;
            }


            if (fcmTokenList && Array.isArray(fcmTokenList) && fcmTokenList.length && fcmTokenList.length == 1) {
                messageNotification.token = fcmTokenList[0].token;
            } else if (fcmTokenList && Array.isArray(fcmTokenList) && fcmTokenList.length && fcmTokenList.length > 1) {
                messageNotification.tokens = fcmTokenList.map(v => v.token);
            }

            if (messageNotification.token) {
                admin.messaging().send(messageNotification).then(res => {
                    response.data = res;
                    response.status = true;
                }).catch(err => {
                    throw err;
                });
            } else if (messageNotification.tokens) {
                const chunkedTokens = chunkArray(messageNotification.tokens, 500);
                for (const tokens of chunkedTokens) {
                    try {
                        await admin.messaging().sendEachForMulticast({
                            tokens: tokens,
                            notification: messageNotification.notification
                        });
                    } catch (error) {
                        console.log("error", error)
                    }
                }
                // admin.messaging().sendEachForMulticast(messageNotification).then(res => {
                //     response.data = res;
                //     response.status = true;
                // }).catch(err => {
                //     throw err;
                // });
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async newCarInBid({ dealerCarId, dealerId = null, bidId }) {
        try {
            const { data: biddingCarDetails } = await dealerCarMarketPlaceServices.details({ _id: dealerCarId });
            const title = `${(biddingCarDetails.dealerDetails.name) || "Someone"} ${biddingCarDetails?.dealerDetails?.location ? ("(" + biddingCarDetails.dealerDetails.location + ")") : ""} added a car for bidding ${biddingCarDetails.brandName}`;
            const body = `${biddingCarDetails.modelName} ${biddingCarDetails.variantName} (${biddingCarDetails.manufacturingYear}) total driven: ${biddingCarDetails.kmsDriven.toLocaleString('en-IN')}KM asking for: ₹${biddingCarDetails.askingPrice.toLocaleString('en-IN')}`;
            this.pushNotification({
                dealerId,
                title: title,
                body: body,
                data: {
                    bidId
                },
                image: biddingCarDetails?.thumbnailImage
            });
            try {
                await notificationServices.save({
                    dealerCarId,
                    fromDealerId: biddingCarDetails.dealerDetails._id,
                    biddingLiveId: bidId,
                    title: title,
                    description: body,
                    type: 'Car In Bidding'
                });
            } catch (error) {

            }
        } catch (error) {
        }
    }

    static async newCarInMarketPlace({ dealerCarId, dealerId = null, marketPlaceId }) {
        try {
            const { data: biddingCarDetails } = await dealerCarMarketPlaceServices.details({ _id: dealerCarId });
            const title = `${(biddingCarDetails.dealerDetails.name) || "Someone"} ${biddingCarDetails?.dealerDetails?.location ? ("(" + biddingCarDetails.dealerDetails.location + ")") : ""} added a car im market ${biddingCarDetails.brandName}`;
            const body = `${biddingCarDetails.modelName} ${biddingCarDetails.variantName} (${biddingCarDetails.manufacturingYear}) total driven: ${biddingCarDetails.kmsDriven.toLocaleString('en-IN')}KM asking for: ₹${biddingCarDetails.askingPrice.toLocaleString('en-IN')}`;
            this.pushNotification({
                dealerId,
                title: title,
                body: body,
                data: {
                    marketPlaceId
                },
                image: biddingCarDetails?.thumbnailImage
            });
            try {
                await notificationServices.save({
                    dealerCarId,
                    fromDealerId: biddingCarDetails.dealerDetails._id,
                    biddingLiveId: marketPlaceId,
                    title: title,
                    description: body,
                    type: 'Car In Market'
                });
            } catch (error) {

            }
        } catch (error) {
        }
    }

    static async newBidFromDealer({ biddingDetails, dealerId }) {
        try {
            if (dealerId) {
                const { data: dealerDetails } = await dealerServices.dealerData(biddingDetails.dealerId);
                const title = `${dealerDetails.dealershipName || "A dealer"} ${dealerDetails.rtoName ? ("(" + dealerDetails.rtoName + ")") : ""} placed a bid of ₹${biddingDetails.bidAmount.toLocaleString('en-IN')}`;
                this.pushNotification({
                    dealerId,
                    title: title,
                    body: ``,
                    data: {
                        bidId: biddingDetails.liveBiddingId
                    }
                });
                try {
                    await notificationServices.save({
                        dealerId,
                        fromDealerId: biddingDetails.dealerId,
                        dealerCarId: biddingDetails.dealerCarId,
                        biddingLiveId: biddingDetails.liveBiddingId,
                        biddingId: biddingDetails._id,
                        title: title,
                        type: 'Bidding Offer Received'
                    });
                } catch (error) {

                }
            }
        } catch (error) {
        }
    }

    static async newOfferFromDealer({ offerDetails, dealerId }) {
        try {
            if (dealerId) {
                const { data: dealerDetails } = await dealerServices.dealerData(offerDetails.dealerId);
                const title = `${dealerDetails.dealershipName || "A dealer"} ${dealerDetails.rtoName ? ("(" + dealerDetails.rtoName + ")") : ""} placed an offer of ₹${offerDetails.amount.toLocaleString('en-IN')}`;
                this.pushNotification({
                    dealerId,
                    title: title,
                    body: ``,
                    data: {
                        marketPlaceLiveId: offerDetails.marketPlaceLiveId
                    }
                });

                try {
                    await notificationServices.save({
                        dealerId,
                        fromDealerId: offerDetails.dealerId,
                        dealerCarId: offerDetails.dealerCarId,
                        marketPlaceId: offerDetails.marketPlaceLiveId,
                        offerId: offerDetails._id,
                        title: title,
                        type: 'Market Offer Received'
                    });
                } catch (error) {

                }
            }
        } catch (error) {
        }
    }


}

module.exports = notificationUserService;