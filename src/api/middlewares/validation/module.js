const { check } = require('express-validator');
const moduleModel = require('../../../models/module');
const { formValidation } = require('../others');

const validations = [

    check('title')
        .notEmpty().withMessage('Title is required'),

    check('code')
        .notEmpty().withMessage('Code is required')
        .isSlug().withMessage('Code must be in valid format')
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await moduleModel.findOne({ code: value });
            if ((result && !body._id) || (result && (result._id != body._id))) {
                throw new Error("A module already exist with this code");
            }
        }),

    formValidation
];

module.exports = validations;