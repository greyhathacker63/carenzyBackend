const { check } = require("express-validator");
const { formValidation } = require("../others");
const brandService = require("../../../services/brand");
const brandModelService = require("../../../services/brandModel");
const colorService = require("../../../services/color");
const rtoService = require("../../../services/rto");
const stateService = require("../../../services/state");
const cityService = require("../../../services/city");
const modelVariantService = require("../../../services/modelVariant");
const fuleTypeService = require("../../../services/fuleType");
const dealerCarMarketPlaceService = require("../../../services/dealerCarMarketPlace");
const dealerCarService = require("../../../services/dealerCar");

const validations = {
    dealerCarValidation: [
        // check("type")
        //     .notEmpty().withMessage("Please select where you want to display the car. It should be from 'Market', 'Bidding'")
        //     .isArray().withMessage("Display type should be in list(Array) "),

        // check("type.*")
        //     .isIn(['Market', 'Bidding']).withMessage("You should display car in 'Market', 'Bidding'"),

        // check("registrationNumber")
        //     .trim()
        //     .notEmpty().withMessage("Please enter car registration number"),
        // .matches(/^(?:IND\s?)?[A-Z]{2}\s?[0-9]{1,2}\s?(?:[A-Z]{1,3})?\s?[0-9]{4}(?:\s?IND)?$/).withMessage("Invalid car registration number"),

        // check("collaboration")
        //     .trim()
        //     .notEmpty().withMessage("Please enter collaboration field"),

        // check("information")
        //     .trim()
        //     .notEmpty().withMessage("Please enter vehicle information"),

        check("askingPrice")
            .trim()
            .notEmpty().withMessage("Please enter asking price of this vehicle")
            .isNumeric().withMessage("Asking price must be a numer"),

        // check("biddingIncGap")
        //     .trim().optional()
        //     .notEmpty().withMessage("Please enter Bidding Incremental Gap of this vehicle")
        //     .isNumeric().withMessage("Bidding Incremental Gap must be a numer"),

        check("brandId")
            .trim()
            .notEmpty().withMessage("Please select a brand")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await brandService.listFront({ _id: value });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Selected brand does not exist");
                }
            }),

        check("modelId")
            .trim()
            .notEmpty().withMessage("Please select a model")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await brandModelService.listFront({ _id: value, brandId: req.body.brandId });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Selected model does not fall under the selected brand");
                }
            }),

        check("manufacturingMonth")
            .trim()
            .notEmpty().withMessage("Please select a manufacturing month")
            .matches(/^(0[1-9]|1[0-2])$/).withMessage("Selected manufacturing month is not valid"),

        check("manufacturingYear")
            .trim()
            .notEmpty().withMessage("Please select manufacturing year")
            .matches(/^(19\d{2}|20\d{2}|2100)$/).withMessage("Selected manufacturing year is not valid"),

        check("registrationMonth")
            .trim()
            .notEmpty().withMessage("Please select a registration month")
            .matches(/^(0[1-9]|1[0-2])$/).withMessage("Selected registration month is not valid"),

        check("registrationYear")
            .trim()
            .notEmpty().withMessage("Please select registration year")
            .matches(/^(19\d{2}|20\d{2}|2100)$/).withMessage("Selected registration year is not valid"),

        check("variantId")
            .trim()
            .notEmpty().withMessage("Please select a variant")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await modelVariantService.listFront({ _id: value, brandModelId: req.body.modelId });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Selected variant does not fall under the selected model");
                }
            }),

        check("kmsDriven")
            .trim()
            .notEmpty().withMessage("Please enter KM's driven")
            .isNumeric().withMessage("KM's driven should be a number"),

        check("fuelTypeId")
            .trim()
            .notEmpty().withMessage("Please select a fuel type")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await fuleTypeService.listFront({ _id: value });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Selected fuel type does not exist");
                }
            }),

        check("transmissionType")
            .optional()
            .trim()
            // .notEmpty().withMessage("Please select a transmission type")
            .isIn(["Automatic", "Manual"]).withMessage("Transmission type should be either 'Automatic' or 'Manual'"),

        check("keys")
            .trim()
            .notEmpty().withMessage("Please select number of keys")
            .isNumeric().withMessage("Number of keys entered should be numeric"),

        check("paintedPiecesCount")
            .trim()
            .optional()
            .isNumeric().withMessage("Number of painted pieces should be numeric"),

        // check("colorId")
        //     .trim()
        //     .notEmpty().withMessage("Please select a color for this vehicle")
        //     .custom(async (value, { req }) => {
        //         try {
        //             if (value) {
        //                 const { data } = await colorService.details(value);
        //                 if (!data) {
        //                     throw new Error();
        //                 }
        //             }
        //         } catch (err) {
        //             throw new Error("Selected color does not exist");
        //         }
        //         try {
        //             if (value) {
        //                 const { data } = await brandModelService.details(req.body.modelId);
        //                 if (!data || (data && !data?.colorIds.map(v => v.toString())?.includes(value))) {
        //                     throw new Error();
        //                 }
        //             }
        //         } catch (err) {
        //             throw new Error("Selected color does not exist under the selected car model");
        //         }
        //     }),

        check("rtoId")
            .trim()
            .notEmpty().withMessage("Please select a RTO")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await rtoService.list({ _id: value });
                        if (!data) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Selected RTO does not exist");
                }
            }),

        // check("stateId")
        //     .trim()
        //     .notEmpty().withMessage("Please select registration state")
        //     .custom(async (value, { req }) => {
        //         try {
        //             if (value) {
        //                 const { data } = await stateService.details(value);
        //                 if (!data) {
        //                     throw new Error();
        //                 }
        //             }
        //         } catch (err) {
        //             throw new Error("Selected State does not exist");
        //         }
        //     }),

        // check("cityId")
        //     .trim()
        //     .notEmpty().withMessage("Please select registration city")
        //     .custom(async (value, { req }) => {
        //         try {
        //             if (value) {
        //                 const { data } = await cityService.details(value);
        //                 if (!data) {
        //                     throw new Error();
        //                 }
        //                 if (data.stateId != req.body.stateId) {
        //                     throw new Error("Selected City does not exist under the selected State");
        //                 }
        //             }
        //         } catch (err) {
        //             throw new Error("Selected City does not exist");
        //         }
        //     }),

        check("numberOfOwners")
            .trim()
            .notEmpty().withMessage("Please select number of owners")
            .isNumeric().withMessage("Number of owner should be numeric"),

        check("insuranceExpiryMonth")
            .optional()
            .trim()
            .notEmpty().withMessage("Please select insurance expiry month")
            .matches(/^(0[1-9]|1[0-2])$/).withMessage("Selected insurance expiry month is not valid"),

        check("insuranceExpiryYear")
            .optional()
            .trim()
            .notEmpty().withMessage("Please select insurance expiry year")
            .matches(/^(19\d{2}|20\d{2}|2100)$/).withMessage("Selected insurance expiry year is not valid"),

        check("insuranceType")
            .trim()
            .notEmpty().withMessage("Please select a insurance type")
            .isIn(["Comprehensive", "Zero Depreciation", "3rd Party", "Insurance Expired"]).withMessage("Insurance type should be either 'Comprehensive', 'Zero Depreciation', '3rd Party' or 'Insurance Expired'"),

        // check("bonusNotClaimed")
        //     .notEmpty().withMessage("Please choose 'No Claim Bonus'")
        //     .isBoolean().withMessage("'No Claim Bonus' field should have valid data in boolean"),

        // check("bonusNotClaimedPercentage")
        //     .optional()
        //     .custom(async (value, { req }) => {
        //         try {
        //             if (req.body.bonusNotClaimed && req.body.bonusNotClaimedPercentage) {

        //             }
        //         } catch (err) {
        //             throw new Error("Please fill 'No Claim Bonus Percentage' field");
        //         }
        //     })
        //     .isNumeric().withMessage("'No Claim Bonus Percentage' field should be numeric")
        //     .isFloat({ min: 0, max: 100 }).withMessage("'No Claim Bonus Percentage' field should be between 0 to 100"),


        check("thumbnailImage")
            .trim()
            .optional()
            // .notEmpty().withMessage("Please upload thumbnail image")
            .isURL().withMessage("Thumbnail image should have valid url"),

        check("interiorImageVideos")
            .notEmpty().withMessage("Please upload at least one interior image & video")
            .isArray().withMessage("Interior image & video should be mutiple. It can not have blank data"),

        check("interiorImageVideos.*")
            .trim()
            .notEmpty().withMessage("Interior image & video can not have blank data")
            .isURL().withMessage("Interior image & video should have valid url"),

        check("exteriorImageVideos")
            .notEmpty().withMessage("Please upload at least one exterior image & video")
            .isArray().withMessage("Exterior image & video should be mutiple. It can not have blank data"),

        check("exteriorImageVideos.*")
            .trim()
            .notEmpty().withMessage("Exterior image & video can not have blank data")
            .isURL().withMessage("Exterior image & video should have valid url"),

        check("engineImageVideos")
            .notEmpty().withMessage("Please upload at least one engine image & video")
            .isArray().withMessage("Engine image & video should be mutiple. It can not have blank data"),

        check("engineImageVideos.*")
            .trim()
            .notEmpty().withMessage("Engine image & video can not have blank data")
            .isURL().withMessage("Engine image & video should have valid url"),

        check("rcAvailibity")
            .trim()
            .notEmpty().withMessage("Please select RC availibity type")
            .isIn(["Original", "Duplicate", "Lost"]).withMessage("RC availibity should be one from 'Original', 'Duplicate', 'Lost'"),

        // check("ownershipType")
        //     .trim()
        //     .notEmpty().withMessage("Please select ownership type")
        //     // .isIn(['Individual Ownership', 'Joint Ownership', 'Company/Corporate Ownership', 'Leased Ownership', 'Financed Ownership', 'Rental Ownership', 'Fleet Ownership'])
        //     // .withMessage("Ownership type should be one from 'Individual Ownership', 'Joint Ownership', 'Company/Corporate Ownership', 'Leased Ownership', 'Financed Ownership', 'Rental Ownership', & 'Fleet Ownership'"),
        //     .isIn(["First", "Second", "Third"])
        //     .withMessage("Ownership type should be one from 'First', 'Second', 'Third'"),

        // check("rcImages")
        //     .notEmpty().withMessage("Please upload at least one RC image")
        //     .isArray().withMessage("RC image should be mutiple. It can not have blank data"),

        // check("rcImages.*")
        //     .trim()
        //     .notEmpty().withMessage("RC image can not have blank data")
        //     .isURL().withMessage("RC image should have valid url"),

        // check("chassisNumber")
        //     .trim()
        //     .notEmpty().withMessage("Please enter chassis number of vehicle")
        //     .matches(/^[A-HJ-NPR-Z0-9]{17}$/).withMessage("Chassis number entered is not valid"),

        // check("chassisImages")
        //     .notEmpty().withMessage("Please upload at least one chassis image")
        //     .isArray().withMessage("Chassis image should be mutiple. It can not have blank data"),

        // check("chassisImages.*")
        //     .trim()
        //     .notEmpty().withMessage("Chassis image can not have blank data")
        //     .isURL().withMessage("Chassis image should have valid url"),

        check("chassisNumberEmbossing")
            .trim()
            .notEmpty().withMessage("Please select type of chassis number embossing")
            .isIn(["OK", "Rusted", "Repunched", "No Traceable", "Mis Match", "Incomplete"]).withMessage("Chassis number embossing should be one from 'OK', 'Rusted', 'Repunched', 'No Traceable', 'Mis Match', 'Incomplete'"),

        // check("insuranceImages")
        //     .notEmpty().withMessage("Please upload at least one insurance image")
        //     .isArray().withMessage("Insurance image should be mutiple. It can not have blank data"),

        // check("insuranceImages.*")
        //     .trim()
        //     .notEmpty().withMessage("Insurance image can not have blank data")
        //     .isURL().withMessage("Insurance image should have valid url"),

        // check("reportAlreadyPainted")
        //     .trim()
        //     .notEmpty().withMessage("Provide if already painted or not"),

        // check("reportPaintingRequired")
        //     .trim()
        //     .notEmpty().withMessage("Provide if painting is required or not"),

        // check("reportPieceChange")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for piece change"),

        // check("reportStearing")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for stearing"),

        // check("reportSuspension")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for suspension"),

        // check("reportEngine")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for engine"),

        // check("reportAC")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for AC"),

        // check("reportRusting")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for rusting"),

        // check("reportTyres")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for tyres"),

        // check("reportSunroof")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for sunroof"),

        // check("reportInterior")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for interior"),

        // check("reportRefurb")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for refurb"),
        
        // check("reportDescription")
        //     .trim()
        //     .notEmpty().withMessage("Provide value for description"),

        formValidation
    ],
    dealerCarMarketOfferPlaceValidation: [
        check("amount")
            .trim()
            .notEmpty().withMessage("Amount is required to place offer")
            .isNumeric().withMessage("Amount should be numeric"),

        check("marketPlaceLiveId")
            .trim()
            .notEmpty().withMessage("Seems you are not on car details page because you are not choosing any car")
            .custom(async (value, { req }) => {
                let errorMessage = "";
                try {
                    if (value) {
                        const { data } = await dealerCarMarketPlaceService.list({ _id: value });
                        req.body.ownerDealerId = data?.[0]?.dealerDetails?._id;
                        if (!data.length) {
                            errorMessage = "Choosen car does not exist";
                            throw new Error();
                        } else if (data[0]?.askingPrice > req.body.amount && false) {
                            errorMessage = "Amount should be greater than asking amount";
                            throw new Error();
                        } else if (data[0]?.status !== "In List") {
                            errorMessage = "This car is not available now for market";
                            throw new Error();
                        }
                        req.body.dealerCarId = data?.[0]?.dealerCarId;
                    }
                } catch (err) {
                    throw new Error(errorMessage);
                }
            }),

        formValidation
    ],

    dealerCarMarketSoldValidation: [
        check("dealerCarId")
            .trim()
            .notEmpty().withMessage("Seems you are not on car details page because you are not choosing any car")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await dealerCarMarketPlaceService.list({ dealerCarId: value, dealerId: req.__cuser._id });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Choosen car does not exist");
                }
            }),

        formValidation
    ],

    dealerCarRemoveValidation: [
        check("dealerCarId")
            .trim()
            .notEmpty().withMessage("Seems you are not on car details page because you are not choosing any car")
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await dealerCarService.list({ dealerCarId: value, dealerId: req.__cuser._id });
                        if (!data.length) {
                            throw new Error();
                        }
                    }
                } catch (err) {
                    throw new Error("Choosen car does not exist");
                }
            }),

        formValidation
    ]
};

module.exports = validations;