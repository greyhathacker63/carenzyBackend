const { check } = require('express-validator');
const { Types } = require("mongoose");
const authorModel = require('../../../models/author');
const blogModel = require('../../../models/blog');
const { formValidation } = require('../others');

const validations = {
    authorValidation: [
        check("name")
            .trim()
            .notEmpty().withMessage('Name is required'),
        check("avatar")
            .notEmpty().withMessage('Avatar is required'),

        formValidation
    ]

}

module.exports = validations;