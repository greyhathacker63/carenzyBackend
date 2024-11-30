const { check } = require('express-validator');
const { Types } = require("mongoose");
const blogModel = require('../../../models/blog');
const { formValidation } = require('../others');

const validations = {
    blogCommentValidation: [
        check('phone')
            .trim()
            .optional()
            .isNumeric().withMessage("Please enter valid Phone number")
            .custom((value) => {
                if (value.length !== 10) {
                    return Promise.reject("Phone number should be 10 digits");
                } else {
                    return true;
                }
            }),
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email is not valid'),
        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),
        check("blogId")
            .notEmpty().withMessage("please select blog")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await blogModel.findById(Types.ObjectId(value));
                if (result && result.stateId?.toString() !== body.stateId) {
                    throw new Error("Selected blog does not exists in selected blog");
                }
            }),
        formValidation
    ]

}

module.exports = validations;