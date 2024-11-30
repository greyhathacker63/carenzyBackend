const { check, body } = require('express-validator');
const { formValidation } = require('../others');
const FeatureModel = require("../../../models/feature");
const Response = require('../../../utilities/Response');
const { Types } = require("mongoose");
const { clearSearch } = require("../../../utilities/Helper")

const validations = {
    featureDataValidation: [
        check('featureId')
            .notEmpty().withMessage('feature id is required'),

        check('name')
            .notEmpty().withMessage('specs name is required'),

        formValidation
    ],
    checkText: async (req, res, next) => {
        try {
            let body = req.body;
            const search = {
                _id: body._id ? { $ne: Types.ObjectId(body._id) } : '',
                featureId: body.featureId ? Types.ObjectId(body.featureId) : '',
                isDeleted: false,
            };
            clearSearch(search);
            const docData = await FeatureModel.findById(body.featureId);
            if (docData.text) {

            }
            else {
                next()
            }
        } catch (err) {
            Response.fail(res, Response.createError("", err));
        }
    }
};

module.exports = validations;