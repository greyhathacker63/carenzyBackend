const { check } = require('express-validator');
const { Types } = require('mongoose');
const { formValidation } = require('../others');
const subMasterModel = require('../../../models/subMaster');
const subMasterDataModel = require('../../../models/subMasterData');

const validations = {
    masterValidation: [

        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),

        formValidation
    ],
    subMasterValidation: [

        check('masterId')
            .notEmpty().withMessage('Seems you have not selected any parent master'),

        check('name')
            .trim()
            .notEmpty().withMessage('Name is required'),

        check('dataType')
            .notEmpty().withMessage('Please choose data type')
            .isIn(["radio", "checkbox", "text", "boolean"]).withMessage('Data type should be one of from "Radio", "Checkbox", "Text", "Boolean"'),

        formValidation
    ],

    subMasterDataValidation: [

        check('subMasterId')
            .notEmpty().withMessage('Seems you have not selected any sub master'),

        check('title')
            .trim()
            .notEmpty().withMessage('Title is required'),

        // check('*')
        //     .custom(async (value, { req }) => {
        //         const { subMasterId, _id } = req.body;
        //         if (subMasterId) {
        //             const subMasterDetails = await subMasterModel.findById(subMasterId);
        //             if (subMasterDetails && subMasterDetails.dataType === 'text') {
        //                 const dataList = await subMasterDataModel.find({ subMasterId: Types.ObjectId(subMasterId) });
        //                 if(dataList.length > 1){
        //                     throw new Error(`Since data type of ${subMasterDetails.name} is Test so you can not add more than one data`);
        //                 } else if(dataList.length === 1 && dataList[0]._id.toString() !== _id ){
        //                     throw new Error(`Since data type of "${subMasterDetails.name}" is "Text" so you can not add more than one data`);
        //                 }
        //             }
        //         }
        //     }),

        formValidation
    ],
};

module.exports = validations;