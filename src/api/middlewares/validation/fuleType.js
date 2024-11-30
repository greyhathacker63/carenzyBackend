const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    fuleTypeValidation: [

        check('name')
            .trim()
            .notEmpty().withMessage('Please enter name'),

        formValidation
    ]
};

module.exports = validations;