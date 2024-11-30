const { check } = require('express-validator');

const validations = {
    file: [
        // check('file')
        //     .notEmpty().withMessage('File is required'),
    ],

    fileBase64: [
        check('file')
            .notEmpty().withMessage('File is required'),
    ]
}

module.exports = validations;