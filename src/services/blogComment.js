const { Types } = require("mongoose");
const blogCommentModel = require("../models/blogComment");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class blogCommentService {
    // Author service : 
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await blogCommentModel.findOne({ _id: _id, isDeleted: false }).populate({ path: 'blogId', select: ['-status', '-isDeleted'] });
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
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                status: query.forFront ? true : "",
                blogId: query.blogId ? Types.ObjectId(query.blogId) : "",
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: "blogs",
                        localField: "blogId",
                        foreignField: "_id",
                        as: "blogDetails",
                        pipeline: [
                            {
                                $project: {
                                    title: 1,
                                },
                            },
                        ]
                    },
                },
                { $unwind: { path: "$blogDetails" } },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        phone: 1,
                        website: 1,
                        comment: 1,
                        blogDetails: 1,
                        createdAt:1
                    }
                },
            ];
            response = await paginationAggregate(blogCommentModel, $aggregate, $extra);
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
            const docData = _id ? await blogCommentModel.findById(_id) : new blogCommentModel();

            docData.name = data.name;
            docData.email = data.email;
            docData.phone = data?.phone;
            docData.website = data?.website;
            docData.comment = data.comment;
            docData.blogId = data.blogId;
            docData.status = data.status || docData.status;

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
                await blogCommentModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await blogCommentModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = blogCommentService;