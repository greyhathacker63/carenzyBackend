const { check } = require('express-validator');
const { Types } = require("mongoose");
const authorModel = require('../../../models/category');
const blogModel = require('../../../models/blog');
const { formValidation } = require('../others');

const validations = {
    categoryValidation: [
        check("name")
            .trim()
            .notEmpty().withMessage('Name is required'),
            check("slug").notEmpty().withMessage('Slug is Required'),

        formValidation
    ]

}

module.exports = validations;