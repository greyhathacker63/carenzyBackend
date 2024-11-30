const { check } = require('express-validator');
const { formValidation } = require('../others');
const metadataService = require('../../../services/metadata');

const validations = {
    reportValidation: [
        check('metadataId')
            .notEmpty().withMessage('Choose report type')
            .custom(async (value, { req }) => {
                try {
                    if (value) {
                        const { data } = await metadataService.list({ type: 'report-problem', _id: value });
                        if (!data?.length) {
                            throw new Error("Choose a valid report type");
                        }
                    }
                } catch (err) {
                    throw new Error("Choose a valid report type");
                }
            }),

        check('message')
            .notEmpty().withMessage('Please fill report description.'),

        formValidation
    ]
};

module.exports = validations;