const { check } = require('express-validator');
const { formValidation } = require('../others');
const subscriptionService = require("../../../services/subscription");
const transactionService = require("../../../services/transaction");
const planService = require("../../../services/plan");

const validations = {
    subscriptionValidation: [
        check('dealerId')
            .notEmpty().withMessage('You are not choosing a dealer'),

        check('planId')
            .notEmpty().withMessage('Please choose a plan')
            .custom(async (value, { req }) => {
                const { data: [planDetails] } = await planService.list({ status: 1, _id: value });
                if (!planDetails) {
                    throw new Error("Selected plan is not available now");
                }
            }),

        // check('receiptUrl')
        //     .notEmpty().withMessage('Upload reciept of the payment'),

        formValidation
    ],

    subscriptionPurcahse: [
        check('planId')
            .notEmpty().withMessage('Please choose a plan')
            .custom(async (value, { req }) => {
                const { data: [planDetails] } = await planService.list({ status: 1, _id: value });
                req.body.dealerId = req.__cuser._id;
                if (!planDetails) {
                    throw new Error("Selected plan is not available now");
                }
            }),

        formValidation
    ],

    setLastDateForTheSubscription: async (req, res, next) => {
        try {
            const { data: [planDetails] } = await planService.list({ status: 1, _id: req.body.planId });
            const { data: { lastDate } } = await subscriptionService.getDealerLastSubscriptionDate(req.body.dealerId);
            if (!req.body._id) {
                /* 
                 * Logic when allowting a new plan
                 */
                let startDate = !lastDate ? new Date() : new Date(lastDate);
                /*
                 * When plan has expired before today
                 */
                if (startDate < new Date()) {
                    startDate = new Date();
                }

                req.body.startDate = startDate;
                req.body.endDate = new Date((startDate.getTime() + planDetails.duration * 24 * 60 * 60 * 1000));
                req.body.duration = planDetails.duration;
                req.body.paidAmount = planDetails.amount;
                req.body.planName = planDetails.name;
                req.body.planDetails = JSON.parse(JSON.stringify(planDetails));
                req.body.planDetails = JSON.stringify(req.body);
            } else {

            }

            next();
        } catch (err) {
            next(new Error(err.message));
        }

    },

    verifyPayment: async (req, res, next) => {
        try {
            const { data: transactionDetails } = await transactionService.details(req.body.transactionId);
            if (transactionDetails && (transactionDetails.dealerId.toString() == req.__cuser._id.toString())) {
                
                /* Payment success check will go here */

                /* 
                 *
                 *
                 *
                 */
                next();
            } else {
                throw new Error("No any transaction found");
            }

        } catch (err) {
            next(new Error(err.message));
        }

    }
};

module.exports = validations;