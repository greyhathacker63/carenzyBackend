const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    plnValidation: [

        check('mrp')
            .notEmpty().withMessage('MRP is required')
            .isNumeric().withMessage("Please enter only Number value")
            .custom(async (value, { req }) => {
                if (parseInt(value) < parseInt(req.body.amount)) {
                    throw new Error("MRP should be grater then amount")
                }
            }),

        check('amount')
            .optional()
            .isNumeric().withMessage("Please enter only number value"),

        check('duration')
            .trim()
            .notEmpty().withMessage('Duration is required'),
        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),
        // check('discount')
        //     .trim()
        //     .notEmpty().withMessage('discount is required'),
        check('benefits')
            .trim()
            .notEmpty().withMessage('Benefits is required'),

        formValidation
    ]
};

module.exports = validations;