const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    colorValidation: [

        check('name')
            .notEmpty().withMessage('Name is required'),

        check('hexCode')
            .notEmpty().withMessage('hex code is required'),

        formValidation
    ]
};

module.exports = validations;