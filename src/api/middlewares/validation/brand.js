const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    brandValidation: [

        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),

        check('icon')
            .notEmpty().withMessage('Please upload brand icon'),

        formValidation
    ]
};

module.exports = validations;