const { check } = require('express-validator');
const { formValidation } = require('../others');
const { clearSearch } = require("../../../utilities/Helper");
const { Types } = require("mongoose");
const dealerModel = require('../../../models/dealer');

const validations = {

    dealerSubscriptionAdmin: [
        check("planId")
            .notEmpty().withMessage("Please select plan"),

        check("dealerId")
            .notEmpty().withMessage("Please select dealer"),
            
        check("transactionid")
            .notEmpty().withMessage("Please select transaction"),
            

        check('name')
            .notEmpty().withMessage("Please enter Name"),

        check('duration')
            .notEmpty().withMessage("Please enter duration"),

        check('startDate')
            .notEmpty().withMessage("Please select data"),

        check('benefits')
            .notEmpty().withMessage("Please enter benefits"),

        check('status')
            .notEmpty().withMessage("Please select status"),


        formValidation
    ],
}

module.exports = validations;