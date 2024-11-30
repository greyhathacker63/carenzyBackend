const { Schema, model, Types } = require('mongoose');
const surveyUserSchema = new Schema({
    surveyQuestionId: {
        type: Types.ObjectId,
        ref: "surver_question"
    },
    surveyQuestionOptionIds: [{
        type: Types.ObjectId,
        ref: "survey_question_option"
    }],
    userId: {
        type: Types.ObjectId,
        ref: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const surveyUser = model('surveyUser', surveyUserSchema);
module.exports = surveyUser;