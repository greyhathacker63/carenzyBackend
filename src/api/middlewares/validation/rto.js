const { check } = require('express-validator');
const { formValidation } = require('../others');
const RTOService = require("../../../services/rto");

const validations = {
    rtoValidation: [

        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),

        check('code')
            .trim()
            .notEmpty().withMessage('RTO code is required')
            .custom(async (value, { req }) => {
                const body = req.body;
                const { data: [result] } = await RTOService.list({ code: value });
                if ((result && !body._id) || (result && (result._id != body._id))) {
                    throw new Error("This RTO code already exist for other RTO");
                }
            }),

        formValidation
    ]
};

module.exports = validations;