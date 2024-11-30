const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    featureValidation: [
        check('specsId')
            .notEmpty().withMessage('specs id is required'),

        check('dataType')
            .notEmpty().withMessage('Data type is required'),

        check('name')
            .notEmpty().withMessage('specs name is required'),

        formValidation
    ]
};

module.exports = validations;