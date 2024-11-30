const { Schema, model, Types } = require('mongoose');
const surveyQuestionOptionSchema = new Schema({
    surveyQuestionId: {
        type: Types.ObjectId,
        ref: "surver_question"
    },
    title: {
        type: String,
        trim: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const surveyQuestionOptionModel = model('survey_question_option', surveyQuestionOptionSchema);
module.exports = surveyQuestionOptionModel;