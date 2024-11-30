const { Types } = require("mongoose");
const brandModel = require("../models/brand");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class brandServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1,
                        icon: 1,
                        status: 1
                    }
                }
            ];
            response = await paginationAggregate(brandModel, $aggregate, $extra);
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
            const docData = _id ? await brandModel.findById(_id) : new brandModel();

            docData.name = data.name;
            docData.icon = data.icon;
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
                await brandModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await brandModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }

    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                // status: true,
                isDeleted: false
            };

            clearSearch(search);
            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        name: 1,
                        icon: 1,
                        status: 1,
                        modelDetails: 1
                    }
                }
            ];

            if (query.withModels != "NA" && query.withModels) {
                $aggregate.push(
                    {
                        $lookup: {
                            from: 'brand_models',
                            localField: '_id',
                            foreignField: 'brandId',
                            as: 'modelDetails',
                            pipeline: [
                                {
                                    $match: { /* status: true, */ isDeleted: false }
                                },
                                {
                                    $project: {
                                        name: '$name',
                                    }
                                }
                            ]
                        }
                    }
                )
            }
            if (query.withModelVariants != "NA" && query.withModelVariants) {
                $aggregate.push(
                    {
                        $lookup: {
                            from: 'brand_models',
                            localField: '_id',
                            foreignField: 'brandId',
                            as: 'modelDetails',
                            pipeline: [
                                {
                                    $match: { /* status: true, */ isDeleted: false }
                                },
                                {
                                    $lookup: {
                                        from: 'model_variants',
                                        localField: '_id',
                                        foreignField: 'brandModelId',
                                        as: 'variantDetails',
                                        pipeline: [
                                            {
                                                $match: { /* status: true, */ isDeleted: false }
                                            },
                                            {
                                                $project: {
                                                    name: 1,
                                                    year: 1
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        name: 1,
                                        variantDetails: 1
                                    }
                                }
                            ]
                        }
                    }
                )
            }
            response = await paginationAggregate(brandModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = brandServices;