const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    metadataValidation: [
        check('name')
            .trim()
            .notEmpty().withMessage("Metadata title is required"),

        check('type')
            .notEmpty().withMessage("Metadata type is required")
            .isIn(["dealership-registration-certificate", "report-problem"]).withMessage("Metadata type should be either \"Dealership Registration Certificate\", or \"Report Problem\""),
        formValidation
    ]
};

module.exports = validations;