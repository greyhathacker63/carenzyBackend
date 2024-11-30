const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String
    },
    slug: {
        type: String
    },
    description: {
        type: String
    },
    shortDescription: {
        type: String
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'author'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    date: {
        type: Date
    },
    thumbnailImgUrl: {
        type: String
    },
    featureImgUrl: {
        type: String
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
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

const blogModel = model('blog', blogSchema);

module.exports = blogModel;