const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    saveValidation: [
        check('type')
            .trim()
            .notEmpty().withMessage('Something went wrong')
            .isIn(['Bidding Duration', 'Market Car Count', 'Add Extra Number In Market Car Count', 'Video Tutorial Url']).withMessage('Something went wrong'),

        check('value')
            .trim()
            .notEmpty().withMessage('Provide a value')
            .custom(async (value, { req }) => {
                if (req.body.type == 'Bidding Duration' && value && (isNaN(value)) ) {
                    throw new Error('Bidding duration must be in minutes');
                } else if (req.body.type == 'Market Car Count' && value && (isNaN(value)) ) {
                    throw new Error('Market car count be in number');
                } else if (req.body.type == 'Add Extra Number In Market Car Count' && value && (isNaN(value)) ) {
                    throw new Error('Add extra number in Market car count be in number');
                }
            }),

        formValidation
    ]
};

module.exports = validations;