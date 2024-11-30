const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    bannerValidation: [
        check('position')
            .trim()
            .notEmpty().withMessage('Please select position.'),

        check('url')
            .trim()
            .notEmpty().withMessage('Please uploade image.'),

        check('visibleTo')
            .trim()
            .notEmpty().withMessage('Please choose who to show')
            .isIn(["Unverified Accounts", "Incomplete Accounts", "Verified / Complete Accounts", "All Accounts"]).withMessage('Visible to is not valid'),

        formValidation
    ]
};

module.exports = validations;