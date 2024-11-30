const { check } = require('express-validator');
const { formValidation } = require('../others');
const brandService = require('../../../services/brand');
const brandModelService = require('../../../services/brandModel');
const modelVariantService = require('../../../services/modelVariant');

const validations = {
    getDetailValidation: [
        check("brandId")
            .notEmpty().withMessage("Choose a brand")
            .custom(async (value) => {
                const { data } = await brandService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Brand not exist. Please Refresh the Page and check again.");
                }
            }),

        check("modelId")
            .notEmpty().withMessage("Choose a model")
            .custom(async (value) => {
                const { data } = await brandModelService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Model not exist. Please Refresh the page and check again.");
                }
            }),

        check("variantId")
            .notEmpty().withMessage("Choose a variant")
            .custom(async (value) => {
                const { data } = await modelVariantService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Variant not exist. Please Refresh the page and check again.");
                }
            }),

        check("year")
            .trim()
            .notEmpty().withMessage("Year is required")
            .isNumeric().withMessage("Year must be numeric"),

        formValidation
    ],

    bodyValidation: [
        check("brandId")
            .notEmpty().withMessage("Choose a brand")
            .custom(async (value, { req }) => {
                const { data } = await brandService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Brand not exist. Please Refresh the Page and check again.");
                }
            }),

        check("modelId")
            .notEmpty().withMessage("Choose a model")
            .custom(async (value) => {
                const { data } = await brandModelService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Model not exist. Please Refresh the page and check again.");
                }
            }),

        check("variantId")
            .notEmpty().withMessage("Choose a variant")
            .custom(async (value) => {
                const { data } = await modelVariantService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Variant not exist. Please Refresh the page and check again.");
                }
            }),

        check("year")
            .trim()

            .notEmpty().withMessage("Year is required")
            .isNumeric().withMessage("Year must be numeric"),

        check("milage")
            .trim()

            .notEmpty().withMessage("Milage is required"),

        check("bhp")
            .trim()

            .notEmpty().withMessage("BHP is required"),

        check("enginePower")
            .trim()

            .notEmpty().withMessage("Engine Power is required"),

        check("description")
            .trim()

            .notEmpty().withMessage("Description is required"),

        check("waitingPeriod")
            .trim()

            .notEmpty().withMessage("Waiting Period is required")
            .isNumeric().withMessage("Waiting Period should be numeric"),

        check("price.showroom")
            .trim()

            .notEmpty().withMessage("Showroom price is required")
            .isNumeric().withMessage("Showroom price should be numeric"),

        check("price.rto")
            .trim()

            .notEmpty().withMessage("RTO price is required")
            .isNumeric().withMessage("RTO price should be numeric"),

        // check("price.others")
        //  .notEmpty().withMessage("Other's Price is required")
        //  .isNumeric().withMessage("Other price should be numeric")   ,

        check("price.insurance")
            .trim()

            .notEmpty().withMessage("Insurance price is required")
            .isNumeric().withMessage("Insurance price should be numeric"),

        check("charge.accessories")
            .trim()

            .notEmpty().withMessage("Accessories charge is required")
            .isNumeric().withMessage("Accessories charge should be numeric"),

        // check("charge.miscellaneous")
        //     .notEmpty().withMessage("Miscellaneous charge is required")
        //     .isNumeric().withMessage("Miscellaneous charge should be numeric"),

        check("charge.extendedWarranty")
            .trim()

            .notEmpty().withMessage("Extended warranty charge is required")
            .isNumeric().withMessage("Extended charge should be numeric"),

        formValidation
    ]
};

module.exports = validations;