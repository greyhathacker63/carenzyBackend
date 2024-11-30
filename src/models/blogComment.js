const { Schema, model } = require('mongoose');

const blogCommentSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'blog'
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    comment: {
        type: String
    },
    website: {
        type: String
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

const blogCommentModel = model('blogComment', blogCommentSchema);

module.exports = blogCommentModel;