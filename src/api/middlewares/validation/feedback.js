const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {

    feedbackForm: [

        check('name')
            .trim()
            .notEmpty().withMessage("Please fill your name"),

        check('phone')
            .trim()
            .notEmpty().withMessage("Please fill your phone number")
            .isNumeric().withMessage("Please enter valid phone number"),

        check("message")
            .trim()
            .notEmpty().withMessage("Please fill your message"),

        formValidation
    ],

}

module.exports = validations;