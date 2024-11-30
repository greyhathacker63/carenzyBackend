const { Types } = require("mongoose");
const blogModel = require("../models/blog");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class blogService {
    // Blog service : 

    static async detailsAdmin(data) {
        const response = { data: {}, status: false };
        try {
            response.data = await blogModel.findOne({ _id: Types.ObjectId(data._id), isDeleted: false });
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async details(data) {
        const response = { data: {}, status: false };
        try {
            // if (data._id) {
            //     data._id = Types.ObjectId(data._id)
            // }

            clearSearch(data);
            response.data = await blogModel.findOne({ ...data, isDeleted: false }).populate({ path: 'authorId', select: ['-createdAt', '-updatedAt', '-__v', '-status', '-isDeleted'] });
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                title: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                status: query.status ? (query.status == "1" ? true : false) : "",
                isDeleted: false,
                slug: query.ignoreSlug ? { $ne: query.ignoreSlug } : ''
            };

            const searchCategory = {
                slug: query.categorySlug ? query.categorySlug : ''
            };

            clearSearch(search);
            clearSearch(searchCategory);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: "authors",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "authorDetails",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                },
                            },
                        ]
                    },
                },
                { $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categoryDetails",
                        pipeline: [
                            { $match: searchCategory },
                            {
                                $project: {
                                    name: 1,
                                },
                            },
                        ]
                    },
                    hidden: !searchCategory.slug
                },
                { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: false }, hidden: !searchCategory.slug },
                {
                    $project: {
                        title: 1,
                        status: 1,
                        slug: 1,
                        // description: 1,
                        shortDescription: 1,
                        authorDetails: 1,
                        date: 1,
                        thumbnailImgUrl: 1,
                        featureImgUrl: 1,
                        metaTitle: 1,
                        authorId: 1,
                        metaDescription: 1,
                        categoryDetails: 1,
                        categoryId: 1,
                    }
                },
            ].filter(v => !v.hidden).map(v => { delete v.hidden; return v; });

            response = await paginationAggregate(blogModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await blogModel.findById(_id) : new blogModel();

            docData.title = data.title;
            docData.slug = data.slug;
            docData.description = data.description;
            docData.shortDescription = data.shortDescription;
            docData.authorId = data.authorId;
            docData.categoryId = data.categoryId;
            docData.date = data.date;
            docData.thumbnailImgUrl = data.thumbnailImgUrl;
            docData.featureImgUrl = data.featureImgUrl;
            docData.metaTitle = data?.metaTitle;
            docData.metaDescription = data?.metaDescription;
            docData.status = data.status;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }


    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await blogModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await blogModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }
}

module.exports = blogService;