
const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    contactUsValidation: [

        check("value")
            .notEmpty().withMessage("Value is required"),
            
        formValidation,
    ],
};

module.exports = validations;
