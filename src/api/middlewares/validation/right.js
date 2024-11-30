const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    rightsValidation: [
        check('name')
            .notEmpty().withMessage('Name is Required.'),
        check('code')
            .notEmpty().withMessage('Code is required'),
            
        formValidation
    ]
};

module.exports = validations;