const { Types } = require("mongoose");
const { check } = require('express-validator');
const { formValidation } = require('../others');
const { clearSearch, } = require("../../../utilities/Helper");
const cityModel = require("../../../models/city");

const validations = {
    cityValidation: [
        check('stateId')
            .notEmpty().withMessage('Please select state'),

        check('name')
            .notEmpty().withMessage('Name is required'),

        check('code')
            .notEmpty().withMessage('Code is required')
            .custom(async (value, { req }) => {
                const search = {
                    _id: req.body._id ? { $ne: Types.ObjectId(req.body._id) } : '',
                    code: req.body.code ? req.body.code : '',

                };

                clearSearch(search);
                const result = await cityModel.findOne({ ...search });
                if (result) {
                    throw new Error('This code already exist');
                }
            }),

        formValidation
    ]
};

module.exports = validations;