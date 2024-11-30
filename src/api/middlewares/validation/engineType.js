const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    engineTypeValidation: [

        check('name')
            .notEmpty().withMessage('Engine type is required'),

        formValidation
    ]
};

module.exports = validations;