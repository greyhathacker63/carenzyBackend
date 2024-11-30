const { check } = require('express-validator');
const { formValidation } = require('../others');
const brandModel = require('../../../models/brandModel');

const validations = {
    modelVariantValidation: [
        // check("brandId")
        //     .notEmpty().withMessage("It seems you have not choosen any brand"),

        check("brandModelId")
            .notEmpty().withMessage("It seems you have not choosen any model"),

        check("name")
            .trim()
            .notEmpty().withMessage("Please enter variant name"),

        // check("year")
        //     .notEmpty().withMessage("Please enter variant year"),
        formValidation
    ]
};

module.exports = validations;