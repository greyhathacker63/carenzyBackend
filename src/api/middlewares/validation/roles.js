const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    rolesValidation: [
        check('name')
            .notEmpty().withMessage('Name is Required.'),
        check('rightCodes')
            .notEmpty().withMessage('Right Codes are Required.'),
        formValidation
    ]
};

module.exports = validations;