const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    applicationValidation: [
        check('data')
            .trim()
            .notEmpty().withMessage('Application Data is required.'),

        check('type')
            .trim()
            .notEmpty().withMessage('Type is required.'),
        formValidation
    ]
};

module.exports = validations;