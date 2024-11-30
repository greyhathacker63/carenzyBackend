const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    bodyTypeValidation: [

        check('icon')
            .notEmpty().withMessage('Please upload icon'),

        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),

        formValidation
    ]
};

module.exports = validations;