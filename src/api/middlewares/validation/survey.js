const { Types } = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");
const { clearSearch } = require("../../../utilities/Helper");
const stateModel = require("../../../models/state");

const validations = {
  surveyQuesValidation: [
    check("title").notEmpty().withMessage("Title is required"),

    check("dataType").notEmpty().withMessage("DataType is required"),
    formValidation,
  ],
};

module.exports = validations;
