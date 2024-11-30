const { check } = require("express-validator");
const { formValidation } = require("../others");
const dealerCarService = require("../../../services/dealerCar");

const validations = {
    dealerPhoneLeadValidation: [
        check("dealerCarId")
            .trim()
            .notEmpty().withMessage("Please choose a dealer car")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await dealerCarService.details({ _id: value });
                        if (!data) {
                            throw new Error();
                        } else {
                            req.body.dealerToId = data.dealerId;
                        }
                    }
                } catch (err) {
                    throw new Error("Selected car does not exist");
                }
            }),

        check("phone")
            .trim()
            .notEmpty().withMessage("Provide phone number"),

        formValidation
    ],
};

module.exports = validations;