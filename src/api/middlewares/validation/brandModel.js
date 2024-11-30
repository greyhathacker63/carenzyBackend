const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {
    brandModelValidation: [
        check("brandId")
            .notEmpty().withMessage("Please select brand"),

        check("name")
            .trim()
            .notEmpty().withMessage("Name is required"),
       
        check("bodyTypeId")
            .notEmpty().withMessage("Please select atleast one body type"),
       
        check("fuelTypeIds")
            .notEmpty().withMessage("Please select atleast one fuel type"),

        check("colorIds")
            .notEmpty().withMessage("Please select atleast one color"),

        check("engineTypeIds")
            .notEmpty().withMessage("Please select atleast one engine type"),

        check("interiorImgs")
            .notEmpty().withMessage("Please upload atleast one interior image")
            .isArray().withMessage("Interior image format is not valid1"),

        check("interiorImgs.*")
            .notEmpty().withMessage("Interior image format is not valid2"),
            // .isURL().withMessage("Interior image format is not valid3"),         

        formValidation
    ]
};

module.exports = validations;