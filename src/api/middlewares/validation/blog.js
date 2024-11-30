const { check } = require('express-validator');
const { Types } = require("mongoose");
const authorModel = require('../../../models/author');
const blogModel = require('../../../models/blog');
const { formValidation } = require('../others');

const validations = {
    blogValidation: [
        check("authorId")
            .notEmpty().withMessage("please select author")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await authorModel.findById(Types.ObjectId(value));
                if (result && result.stateId?.toString() !== body.stateId) {
                    throw new Error("Selected author does not exists in selected author");
                }
            }),

        check("slug")
            .trim().notEmpty().withMessage("Slug is required.")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await blogModel.findOne({ slug: value });
                if (result && result._id != req.body._id) {
                    throw new Error("This slug already exists");
                }
            }),
        check("description")
            .trim()
            .notEmpty().withMessage('Description is required'),
        check("metaDescription")
            .trim()
            .notEmpty().withMessage('Meta Description is required'),
        check("shortDescription")
            .trim()
            .notEmpty().withMessage('Short Description is required'),
        check("title")
            .trim()
            .notEmpty().withMessage('title is required'),
        check("date")
            .trim()
            .notEmpty().withMessage('Date is required'),
        check("status")
            .trim()
            .notEmpty().withMessage('Status is required'),
        check("thumbnailImgUrl")
            .notEmpty().withMessage('Thumbnail Image is required'),
        check("featureImgUrl")
            .notEmpty().withMessage('Feature Image is required'),

        formValidation
    ]

}

module.exports = validations;