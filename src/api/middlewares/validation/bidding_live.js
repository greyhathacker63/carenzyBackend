const { check } = require("express-validator");
const { formValidation } = require("../others");
const dealerCarService = require("../../../services/dealerCar");

const validations = {
    biddingLiveValidation: [
        check("dealerCarId")
            .trim()
            .notEmpty().withMessage("Please select a Car for Bidding.")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await dealerCarService.list({ _id: value });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Selected Bidding Car Id not exist in our DB.");
                }
            }),
        check("startTime")
            .notEmpty().withMessage("Start Time is required."),
        check("endTime")
            .notEmpty().withMessage("End Time is required."),
        check("lastBid")
            .notEmpty().withMessage("Bid Amount is required.")
            .isNumeric().withMessage("Bid Amount needs to be a number."),
        formValidation
    ]
};

module.exports = validations;