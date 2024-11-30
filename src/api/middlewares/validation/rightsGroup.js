const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    rightsGrpValidation: [
        check('name')
            .notEmpty().withMessage('Name is Required.'),
        formValidation
    ]
};

module.exports = validations;