const { Schema, model } = require('mongoose');
const surveyQuestionSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    dataType: {
        type: String,
        enum: ["radio", "checkbox", "text"],
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const surveyQuestionModel = model('survey_question', surveyQuestionSchema);
module.exports = surveyQuestionModel;