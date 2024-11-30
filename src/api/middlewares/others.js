const { validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');

function formValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const customErrors = {
            success: false,
            message: errors.array()[0].msg,
            // errors: errors.errors
            errors: errors.array({ onlyFirstError: true }),
            code: HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY,
            resCode: HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY,
        };
        return res.status(HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY)
            .type('json')
            .send(`${JSON.stringify(customErrors, null, 2)}\n`);
    } else {
        next();
    }
}

module.exports = { formValidation };