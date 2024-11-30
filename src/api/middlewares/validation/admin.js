const { check } = require('express-validator');
const { Types } = require("mongoose");
const adminModel = require('../../../models/admin');
const cityModel = require('../../../models/city');
const { clearSearch } = require("../../../utilities/Helper");
const bcrypt = require('bcryptjs');
const { formValidation } = require('../others');
/*  */
const validations = {
    login: [
        check('email')
            .notEmpty().withMessage('Email name is required')
            .isEmail().withMessage("Please enter valid email"),

        check('password')
            .notEmpty().withMessage("Password is required"),

        formValidation
    ],

    updatePassword: [

        check('currentPassword')
            .notEmpty().withMessage("Current password is required")
            .custom(async (value, { req }) => {
                const isPasswordMatched = await bcrypt.compare(value, req.__cuser.password);
                if (!isPasswordMatched) {
                    throw new Error('Current password is not correct');
                }
            }),

        check('newPassword')
            .notEmpty().withMessage("New password is required"),

        check('confirmNewPassword')
            .notEmpty().withMessage("Confirm new password is required")
            .custom(async (value, { req }) => {
                if (req.body.newPassword !== req.body.confirmNewPassword) {
                    throw new Error('Confirm password and confirm new password does not match');
                }
            }),

        formValidation
    ],

    updateSuperAdmin: [
        check('firstName')
            .trim()
            .notEmpty().withMessage('Firstname is required'),

        check('lastName')
            .trim()
            .notEmpty().withMessage('Lastname is required'),

        check("stateId")
            .notEmpty().withMessage("please select State"),

        check("cityId")
            .notEmpty().withMessage("please select City")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await cityModel.findById(Types.ObjectId(value));
                if (result && result.stateId?.toString() !== body.stateId) {
                    throw new Error("Selected city does not exists in selected state");
                }
            }),
        check("country")
            .notEmpty().withMessage("Please enter Country"),


        check('phone')
            .trim()
            .notEmpty().withMessage('Phone number is required')
            .isNumeric().withMessage("Please enter valid Phone number")
            .custom(async (value, { req }) => {
                const search = {
                    _id: req.__cuser._id ? { $ne: Types.ObjectId(req.__cuser._id) } : '',
                    phone: value,
                    isDeleted: false,
                    type: "superAdmin"
                };
                clearSearch(search);
                const result = await adminModel.find({ ...search });
                if (result?.length) {
                    throw new Error("A user already exits with this phone number");
                }
            })
            .custom((value) => {
                if (value.length !== 10) {
                    return Promise.reject("Phone number should be 10 digits");
                } else {
                    return true;
                }
            }),
        check('pinCode')
            .trim()
            .notEmpty().withMessage("Please enter Pin code")
            .isNumeric().withMessage("Please enter valid pin code")
            .custom((value) => {
                if (value.length !== 6) {
                    return Promise.reject("Pin code should be 6 digits");
                } else {
                    return true;
                }
            }),

        formValidation

    ],

    subAdmin: [

        check("stateId")
            .notEmpty().withMessage("please select State"),

        check("cityId")
            .notEmpty().withMessage("please select City")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await cityModel.findById(Types.ObjectId(value));
                if (result && result.stateId?.toString() !== body.stateId) {
                    throw new Error("Selected city does not exists in selected state");
                }
            }),

        check("roleId")
            .notEmpty().withMessage("please select Role"),

        check('firstName')
            .notEmpty().withMessage('Firstname is required'),

        check('lastName')
            .notEmpty().withMessage('Lastname is required'),

        check('phone')
            .notEmpty().withMessage('Phone number is required')
            .isNumeric().withMessage("Please enter valid Phone number")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await adminModel.findOne({ phone: value });
                if ((result && !body._id) || (result && (result._id != body._id))) {
                    throw new Error("A user already exist with this phone number");
                }
            })
            .custom((value) => {
                if (value.length !== 10) {
                    return Promise.reject("Phone number should be 10 digits");
                } else {
                    return true;
                }
            }),

        check('email')
            .notEmpty().withMessage('Name is required')
            .isEmail().withMessage('Email is not valid')
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await adminModel.findOne({ email: value });
                if ((result && !body._id) || (result && (result._id != body._id))) {
                    throw new Error("A user already exist with this email");
                }
            }),

        check('status')
            .notEmpty().withMessage('Please select status'),

        formValidation
    ]

}

module.exports = validations;
