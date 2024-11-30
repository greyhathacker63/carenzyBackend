const { check } = require('express-validator');
const { formValidation } = require('../others');
const { decryptData } = require("../../../utilities/Helper");
const Response = require("../../../utilities/Response");
const Message = require("../../../utilities/Message");
const config = require('../../../config');
const dealerModel = require('../../../models/dealer');
const dealerLoginModel = require('../../../models/dealerLogin');
const dealerService = require('../../../services/dealer');
const metadataService = require('../../../services/metadata');
const dealer_data_verificationService = require('../../../services/dealer_data_verification');
const rtoService = require('../../../services/rto');

const validations = {

    dealerFromAdmin: [
        check('crz')
            .trim()
            .notEmpty().withMessage("Please enter CRZ number")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ crz: value }));
                if ((data && data._id && !req.body._id) || (data && data._id && (data._id != req.body._id))) {
                    throw new Error("A dealer already exist with this CRZ number");
                }
                if (value.length === 3) {
                    throw new Error("CRZ number is required")
                }
            }),

        check('dealershipName')
            .trim()
            .notEmpty().withMessage("Please enter dealership name"),

        check('name')
            .trim()
            .notEmpty().withMessage("Please enter user name"),

        check('email')
            .trim()
            .notEmpty().withMessage("Please enter emailid")
            .isEmail().withMessage("Please enter valid emailid")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ email: value }));
                if ((data && data._id && !req.body._id) || (data && data._id && (data._id != req.body._id))) {
                    throw new Error("A dealer already exist with this emailid");
                }
            }),

        check("phones")
            .notEmpty().withMessage("Phone number is required")
            .isArray().withMessage("Phone number field data format is not valid. It should be multiple(Array)"),

        check("phones.*")
            .trim()
            .notEmpty().withMessage("Each phone number is required")
            .isNumeric().withMessage("Each phone number should be of type numeric")
            .isLength({ min: 10, max: 10 }).withMessage("Phone number should be of length 10"),

        check("phones")
            .custom(async (value) => {
                if (value && Array.isArray(value) && [...new Set(value)].length < value.length) {
                    throw new Error('Duplicate phone numbers can not be added');
                }
            })
            .custom(async (values, { req }) => {
                const { data } = await dealerService.listDealer({ phones: values });
                if (data?.length && (data.length > 1 || data?.[0]?._id?.toString() !== req.body?._id)) {
                    throw new Error(`A user already exits with this ${data[0].phones.find(v => values.includes(v))} number`);
                }
            }),

        check('rtoId')
            .trim()
            .notEmpty().withMessage("Please choose a RTO")
            .custom(async (value) => {
                const { data } = await rtoService.list({ _id: value });
                if (!data?.length) {
                    throw new Error("Selected RTO is not in database");
                }
            }),

        check("address")
            .trim()
            .notEmpty().withMessage("Please enter address details"),

        check('pinCode')
            .trim()
            .optional()
            .isNumeric().withMessage("PIN code should be numeric")
            .isLength({ min: 6, max: 6 }).withMessage("PIN code should be of 6 digit"),

        check("aadhaarNo")
            .trim()
            .notEmpty().withMessage("Please enter adhar number")
            .isNumeric().withMessage("Please enter valid adhar number")
            .isLength({ min: 12, max: 12 }).withMessage("Adhar number should be of 12 digits")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ crz: value }));
                if ((data && data._id && !req.body._id) || (data && data._id && (data._id != req.body._id))) {
                    throw new Error("A dealer already exist with this adhar number");
                }
            }),

        check("adharFrontImgUrl")
            .trim()
            .notEmpty().withMessage("Please upload adhar front side image"),

        check("adharBackImgUrl")
            .trim()
            .notEmpty().withMessage("Please upload adhar back side image"),

        check("panNo")
            .trim()
            .notEmpty().withMessage("Please enter PAN number")
            .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/).withMessage("Please enter valid PAN number")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ panNo: value }));
                if ((data && data._id && !req.body._id) || (data && data._id && (data._id != req.body._id))) {
                    throw new Error("A dealer already exist with this PAN number");
                }
            }),

        check("panCardimgUrl")
            .trim()
            .notEmpty().withMessage("please upload pan card image"),

        check('gstNo')
            .optional()
            .matches(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/).withMessage("Please enter valid GST number")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ gstNo: value }));
                if ((data && data._id && !req.body._id) || (data && data._id && (data._id != req.body._id))) {
                    throw new Error("A dealer already exist with this GST number");
                }
            }),

        formValidation
    ],
    frontDealerLogin: [
        check('phone')
            .trim()
            .notEmpty().withMessage("Provide your phone number")
            .isLength({ min: 10, max: 10 }).withMessage("Please enter valid phone number"),

        formValidation
    ],
    frontValidateOtp: [
        check('key')
            .notEmpty().withMessage("Error! Missing something."),

        check('otp')
            .notEmpty().withMessage("Provide your OTP"),

        formValidation
    ],
    userOtpSession: async (req, res, next) => {
        try {
            const docData = await dealerLoginModel.findById(decryptData(req.body.key));
            if (((Date.now() - new Date(docData?.otp?.time).getTime()) / 1000) <= config.otpLoginExpDuration) {
                next();
            } else {
                throw new Error(Response.createError(Message.otpExpired));
            }
        } catch (err) {
            Response.fail(res, Response.createError(Message.otpExpired, err));
        }
    },
    checkDealerIsVerified: async (req, res, next) => {
        try {
            const docData = await dealerModel.findOne({ phones: req.body.phones, isDeleted: false });
            if (!docData.status) {
                throw new Error('You are not verified');
            } else {
                next();
            }
        } catch (err) {
            res.status(200).send({ success: false, message: "You are not verified" })
        }
    },
    checkDealerIsValid: async (req, res, next) => {
        try {
            const srvRes = await dealerService.checkAccountStatus({ phone: req.body.phone });
            if (srvRes.data.accountStatus == 'not-exist') {
                Response.fail(res, Response.createError(Message.accountNotExist));
            } /* else if (srvRes.data.accountStatus == 'not-verified') {
                Response.fail(res, Response.createError(Message.accountUnverified));
            } else if (srvRes.data.accountStatus == 'not-active') {
                Response.fail(res, Response.createError(Message.accountInactive));
            } else if (srvRes.data.accountStatus == 'active') {
                next();
            }  */else {
                next();
            }
        } catch (err) {
            Response.fail(res, Response.createError(Message.badRequest, err));
        }
    },
    updateDealerFront: [

        check('name')
            .trim()
            .notEmpty().withMessage("Please enter name"),

        check('rtoId')
            .trim()
            .notEmpty().withMessage("Please choose a RTO")
            .custom(async (value, { req }) => {
                const { data: [first] } = await rtoService.list({ _id: value });
                if (first && first._id) {
                    req.body.stateId = first.stateId;
                } else {
                    throw new Error("Selected RTO is not in database");
                }
            }),

        check('dealershipName')
            .trim()
            .notEmpty().withMessage("Please enter dealership name"),

        check('email')
            .trim()
            .notEmpty().withMessage("Please enter emailid")
            .isEmail().withMessage("Please enter valid emailid")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ email: value }));
                if ((data && data._id && !req.__cuser._id?.toString()) || (data && data._id && (data._id != req.__cuser._id?.toString()))) {
                    throw new Error("A dealer already exist with this emailid");
                }
            }),

        check("address")
            .trim()
            .notEmpty().withMessage("Please enter address details"),

        check('pinCode')
            .trim()
            .optional()
            .isNumeric().withMessage("PIN code should be numeric")
            .isLength({ min: 6, max: 6 }).withMessage("PIN code should be of 6 digit"),

        check("aadhaarNo")
            .trim()
            .notEmpty().withMessage("Please enter adhar number")
            .isNumeric().withMessage("Please enter valid adhar number")
            .isLength({ min: 12, max: 12 }).withMessage("Adhar number should be of 12 digits")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ crz: value }));
                if ((data && data._id && !req.__cuser._id?.toString()) || (data && data._id && (data._id != req.__cuser._id?.toString()))) {
                    throw new Error("A dealer already exist with this adhar number");
                }
            }),

        check("adharFrontImgUrl")
            .trim()
            .notEmpty().withMessage("Please upload adhar front side image"),

        check("adharBackImgUrl")
            .trim()
            .notEmpty().withMessage("Please upload adhar back side image"),

        check("panNo")
            .trim()
            .notEmpty().withMessage("Please enter PAN number")
            .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/).withMessage("Please enter valid PAN number")
            .custom(async (value, { req }) => {
                const { data } = (await dealerService.detailsDealer({ panNo: value }));
                if ((data && data._id && !req.__cuser._id?.toString()) || (data && data._id && (data._id != req.__cuser._id?.toString()))) {
                    throw new Error("A dealer already exist with this PAN number");
                }
            }),

        check("panCardimgUrl")
            .trim()
            .notEmpty().withMessage("please upload pan card image"),

        // check('gstNo')
        //     .trim()
        //     .optional()
        //     .matches(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/).withMessage("Please enter valid GST number")
        //     .custom(async (value, { req }) => {
        //         const { data } = (await dealerService.detailsDealer({ gstNo: value }));
        //         if ((data && data._id && !req.__cuser._id?.toString()) || (data && data._id && (data._id != req.__cuser._id?.toString()))) {
        //             throw new Error("A dealer already exist with this GST number");
        //         }
        //     }),


        // check('registrationCertificateId')
        //     .trim()
        //     .optional()
        //     .custom(async (value, { req }) => {
        //         let message = "";
        //         try {
        //             const { data } = (await metadataService.list({ type: "dealership-registration-certificate", _id: value }));
        //             if ((!data.length)) {
        //                 message = "Selected dealership registration certificate is not in database";
        //                 throw new Error();
        //             } else if (!req.body.registrationCertImgUrl) {
        //                 message = "Please upload registration certificate image";
        //                 throw new Error();
        //             }
        //         } catch (err) {
        //             throw new Error(message.length ? message : err.message);
        //         }
        //     }),

        formValidation
    ],
    updateDealerFrontProfileImg: [
        check("avatar")
            .trim()
            .notEmpty().withMessage("Please your profile picture")
            .isURL().withMessage("Something wrong in uploading image"),

        formValidation
    ],
    updateDealerFrontShopImg: [
        check("shopPhotoUrl")
            .trim()
            .notEmpty().withMessage("Please your shop picture")
            .isURL().withMessage("Something wrong in uploading image"),

        formValidation
    ],
    saveFollower: [
        check('followingId')
            .notEmpty().withMessage("Choose a dealer to follow")
            .custom(async (value, { req }) => {
                if (value == req.__cuser._id.toString()) {
                    throw new Error("You can not follow yourself");
                }
            }),

        formValidation
    ],
    dealerDataVerify: [
        check('dealerId')
            .trim()
            .notEmpty().withMessage("Choose a dealer"),

        check('type')
            .trim()
            .isIn(["Aadhaar Number", "Aadhaar Card Front", "Aadhaar Card Back", "Pan Card Number", "Pan Card Picture", "Shop Picture", "Dealership Registration Document Photo", "GST Number", "GST Certificate Photo"]).withMessage("Choose what you want to reject"),

        check('approvalStatus')
            .trim()
            .notEmpty().withMessage("Choose a dealer")
            .isIn(["pending", "verified", "rejected"]).withMessage("Provide approval status")
            .custom(async (value, { req }) => {
                const { data: ifAlreadyVerified } = await dealer_data_verificationService.checkVerified({ dealerId: req.body.dealerId, type: req.body.type });
                if (ifAlreadyVerified.length) {
                    throw new Error(`"${req.body.type}" has already verified`);
                }
            })
            .custom(async (value, { req }) => {
                if (value === "rejected" && !req.body.message?.trim()) {
                    throw new Error("Provide rejection message");
                }
            }),

        formValidation
    ],
    dealerRating: [
        check('toDealerId')
            .notEmpty().withMessage("Choose a dealer to rate")
            .custom(async (value, { req }) => {
                if (value == req.__cuser._id.toString()) {
                    throw new Error("You can not rate yourself");
                }
            }),

        check('rating')
            .optional()
            .isNumeric({min: 1, max: 5}).withMessage("Rating value must be between 1 to 5"),

        formValidation
    ],
    dealerRatingDelete: [
        check('toDealerId')
            .notEmpty().withMessage("Choose a dealer to delete rating & review"),

        formValidation
    ],
}

module.exports = validations;