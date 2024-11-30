const { check } = require("express-validator");
const { formValidation } = require("../others");
const Response = require("../../../utilities/Response");
const biddingLiveServices = require("../../../services/biddingLive");
const Message = require("../../../utilities/Message");
const biddingModel = require("../../../models/bidding");
const { Types } = require("mongoose");

const validations = {
    biddingValidation: [
        check("bidId")
            .notEmpty().withMessage("Seems you are not on bidding details page. Reason: Bid information is not available"),

        check("bidAmount")
            .notEmpty().withMessage("Bid Amount is required")
            .isNumeric().withMessage("Bid Amount needs to be a number"),

        formValidation
    ],

    biddingDeleteValidation: [
        check("bidId")
            .notEmpty().withMessage("Seems you are not on bidding details page. Reason: Bid information is not available")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const data = await biddingModel.findOne({ _id: value, dealerId: Types.ObjectId(req.__cuser._id),isDeleted: false });
                        if (!data._id) {
                            throw new Error("This bid doesn't placed by you so you can not delete it.");
                        }
                    }
                } catch (err) {
                    throw new Error("This bid doesn't placed by you so you can not delete it.");
                }
            }),

        formValidation
    ],

    verifyDealerCarAndBidAmount: async (req, res, next) => {
        try {
            const { data: [first] } = await biddingLiveServices.listLive({ _id: req.body.bidId, requestingDealerId: req.__cuser._id });
            if (first?._id) {
                if (first.isOwner) {
                    throw new Error("Since you're the owner you can not place any bid for this car")
                } else if (parseInt(first.askingPrice) < parseInt(req.body?.bidAmount)) {
                    const err = new Error(`I am placing ₹ ${req.body?.bidAmount?.toLocaleString('en-IN')} which is greater than your asking amount which is ₹ ${first.askingPrice?.toLocaleString('en-IN')}`);
                    err.code = Message.biddingPriceCrossAskingPrice.code;
                    err.name = Message.biddingPriceCrossAskingPrice.name;
                    throw err;
                } else if ((parseInt(first.lastBid) || 0) + parseInt(first.biddingIncGap || 5000) > parseInt(req.body?.bidAmount)) {
                    throw new Error("The bidding amount needs to be greater than or equal to " + ((parseInt(first.lastBid) || 0) + parseInt(first.biddingIncGap || 5000)));
                }
                req.body.liveBiddingId = req.body.bidId;
                req.body.dealerCarId = first.dealerCarId;
                req.body.ownerDealerId = first.dealerId;
                next();
            } else {
                throw new Error("Selected live bidding car either removed from bidding or not in our database");
            }

        } catch (err) {
            next(Response.createError((err)));
        }
    }
};

module.exports = validations;