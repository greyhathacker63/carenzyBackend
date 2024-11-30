const Response = require('../../../utilities/Response');
const { check } = require('express-validator');
const { Types } = require("mongoose");
const { clearSearch } = require("../../../utilities/Helper")
const { formValidation } = require('../others');
const RTOchargeModel = require("../../../models/rtoCharge");

const validations = {
    rtoChargeValidation: [

        check('registrationType')
            .trim()
            .notEmpty().withMessage('registration type is required'),

        check('minPrice')
            .trim()

            .notEmpty().withMessage('Please enter minimum price')
            .isNumeric("Please enter number value only"),

        check('maxPrice')
            .trim()

            .notEmpty().withMessage('Please enter maximum price')
            .isNumeric("Please enter number value only"),

        check('taxPercentage')
            .trim()

            .notEmpty().withMessage('Please enter tax percent')
            .isNumeric("Please enter number value only")
            .isFloat({ min: 0, max: 99 }).withMessage("Please Enter Discount value between 1 to 99"),
        formValidation
    ],
    checkFuleTypeAndRT: async (req, res, next) => {
        try {
            body = req.body;
            const search = {
                _id: body._id ? { $ne: Types.ObjectId(body._id) } : '',
                fuleTypeId: body.fuleTypeId ? Types.ObjectId(body.fuleTypeId) : '',
                registrationType: body.registrationType,
                isDeleted: false,
            };
            clearSearch(search);
            const docData = await RTOchargeModel.findOne({ ...search });
            if (docData) {
                Response.success(res, "This combination of fuel type and registration type already exist");
            }
        } catch (err) {
            Response.fail(res, Response.createError("This combination of fuel type and registration type already exist", err));
        }
    },
};

module.exports = validations;