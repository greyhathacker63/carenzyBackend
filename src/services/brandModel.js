const { Types } = require("mongoose");
const brandModel = require("../models/brandModel");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class brandModelServices {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await brandModel.findOne({
                _id,
            })
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                name: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
                brandId: query.brandId ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                bodyTypeId: query.bodyTypeId ? Array.isArray(query.bodyTypeId) ? { $in: query.bodyTypeId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.bodyTypeId) : '',
                isDeleted: false
            };

            clearSearch(search);


            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        brandId: 1,
                        name: 1,
                        interiorImgs: 1,
                        exteriorImgs: 1,
                        video: 1,
                        status: 1,
                        bodyTypeId: 1,
                        fuelTypeIds: 1,
                        engineTypeIds: 1,
                        colorIds: 1,
                        videos: 1,
                        description: 1,
                        priceRange: 1
                    }
                },
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
            docData.brandId = data.brandId;
            docData.colorIds = data.colorIds;
            docData.engineTypeIds = data.engineTypeIds;
            docData.fuelTypeIds = data.fuelTypeIds;
            docData.bodyTypeId = data.bodyTypeId;
            docData.interiorImgs = data.interiorImgs;
            docData.exteriorImgs = data.exteriorImgs;
            docData.videos = data.videos;
            docData.description = data.description;
            docData.priceRange = data.priceRange;
            docData.status = data.status ?? docData.status;

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

    static async listCar(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                brandId: query.brandId ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const searchKey = {
                searchKey: query.key ? { '$regex': new RegExp(query.key || ''), $options: 'i' } : '',
            }

            clearSearch(searchKey);


            const $aggregate = [
                // { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'brand_model_likes',
                        localField: '_id',
                        foreignField: 'brandModelId',
                        as: 'likesDetails',
                        pipeline: [
                            {
                                $group: {
                                    _id: "$brandModelId",
                                    likesCount: { $sum: 1 },
                                },
                            }
                        ]
                    }
                },
                { $unwind: { path: "$likesDetails", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'brand_model_likes',
                        localField: '_id',
                        foreignField: 'brandModelId',
                        as: 'ifDealerLiked',
                        pipeline: [
                            {
                                $match: {
                                    dealerId: query?.dealerId ? Types.ObjectId(query?.dealerId) : ''
                                }
                            },
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brandDetails',
                        pipeline: [
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: 'brand_model_bookmarks',
                        localField: '_id',
                        foreignField: 'brandModelId',
                        as: 'ifDealerBookmarked',
                        pipeline: [
                            {
                                $match: {
                                    dealerId: query?.dealerId ? Types.ObjectId(query?.dealerId) : ''
                                }
                            },
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'variant_spec_features',
                        localField: '_id',
                        foreignField: 'modelId',
                        as: 'variantDetails',
                        pipeline: [
                            {
                                $match: { status: true, isDeleted: false }
                            },
                        ]
                    }
                },
                { $match: { ...search, "variantDetails.0": { $exists: true } } },
                {
                    $project: {
                        name: 1,
                        searchKey: { "$concat": ["$name", " ", "$brandDetails.name"] },
                        exteriorImgs: 1,
                        interiorImgs: 1,
                        // priceRange: 1,
                        description: {
                            $cond: ["$description", "$description", ""]
                        },
                        likeCount: {
                            $cond: ["$likesDetails", "$likesDetails.likesCount", 0]
                        },
                        liked: {
                            $cond: [{ $size: "$ifDealerLiked" }, true, false]
                        },
                        bookmarked: {
                            $cond: [{ $size: "$ifDealerBookmarked" }, true, false]
                        },
                        milage: {
                            $ifNull: [{ $arrayElemAt: ["$variantDetails.milage", 0] }, ""]
                        },
                        enginePower: {
                            $ifNull: [{ $arrayElemAt: ["$variantDetails.enginePower", 0] }, ""]
                        },
                        bhp: {
                            $ifNull: [{ $arrayElemAt: ["$variantDetails.bhp", 0] }, ""]
                        },
                        fuelTypeIds: 1,
                        priceRange: {
                            $reduce: {
                                input: "$variantDetails",
                                initialValue: {
                                    start: Number.MAX_SAFE_INTEGER,
                                    end: Number.MIN_SAFE_INTEGER,
                                },
                                in: {
                                    start: {
                                        $cond: [{ $lt: ["$$this.price.showroom", "$$value.start"] }, "$$this.price.showroom", "$$value.start"]
                                    },
                                    end: {
                                        $cond: [{ $gt: ["$$this.price.showroom", "$$value.end"] }, "$$this.price.showroom", "$$value.end"]
                                    }
                                }
                            }
                        }
                    }

                },
            ];
            if (searchKey.searchKey) {
                $aggregate.push({ $match: searchKey });
            }
            $aggregate.push({ $unset: "searchKey" });
            response = await paginationAggregate(brandModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listCarAdmin(query = {}) {
        const $extra = { page: query.page, limit: query.limit, total: query.total, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                name: { '$regex': new RegExp(query.key || ''), $options: 'i' },
                brandId: query.brandId ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                isDeleted: false
            };

            clearSearch(search);


            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'colors',
                        localField: 'colorIds',
                        foreignField: '_id',
                        as: 'colorDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false },
                            },
                            {
                                $project: {
                                    name: 1,
                                    hexCode: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'fuel_types',
                        localField: 'fuelTypeIds',
                        foreignField: '_id',
                        as: 'fuelDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false },
                            },
                            {
                                $project: {
                                    name: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'engine_types',
                        localField: 'engineTypeIds',
                        foreignField: '_id',
                        as: 'engineDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false },
                            },
                            {
                                $project: {
                                    name: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brandName',
                        pipeline: [
                            {
                                $match: { isDeleted: false },
                            },
                            {
                                $project: {
                                    name: 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$brandName", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'variant_spec_features',
                        localField: '_id',
                        foreignField: 'modelId',
                        as: 'variantDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false }
                            },
                        ]
                    }
                },
                {
                    $project: {
                        name: 1,
                        exteriorImgs: 1,
                        interiorImgs: 1,
                        description: {
                            $cond: ["$description", "$description", ""]
                        },
                        milage: { $cond: ["$milage", "$milage", ""] },
                        enginePower: { $cond: ["$enginePower", "$enginePower", ""] },
                        bhp: { $cond: ["$bhp", "$bhp", ""] },
                        colorDetails: 1,
                        fuelDetails: 1,
                        engineDetails: 1,
                        brandName: 1,
                        variantNames: "$variantNames.name",
                        priceRange: {
                            $reduce: {
                                input: "$variantDetails",
                                initialValue: {
                                    start: Number.MAX_SAFE_INTEGER,
                                    end: Number.MIN_SAFE_INTEGER,
                                },
                                in: {
                                    start: {
                                        $cond: [{ $lt: ["$$this.price.showroom", "$$value.start"] }, "$$this.price.showroom", "$$value.start"]
                                    },
                                    end: {
                                        $cond: [{ $gt: ["$$this.price.showroom", "$$value.end"] }, "$$this.price.showroom", "$$value.end"]
                                    }
                                }
                            }
                        }
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

    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                brandId: (query.brandId && query.brandId !== "NA") ? Array.isArray(query.brandId) ? { $in: query.brandId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                bodyTypeId: query.bodyTypeId ? Array.isArray(query.bodyTypeId) ? { $in: query.bodyTypeId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.bodyTypeId) : '',
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
                        brandId: 1
                    }
                },
            ];
            response = await paginationAggregate(brandModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listYearVariants(query = {}) {
        const $extra = { page: query.page, limit: query.limit, total: query.total, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const search = {
                _id: query.modelId ? Types.ObjectId(query.modelId) : '',
                isDeleted: false
            };

            clearSearch(search);


            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'variant_spec_features',
                        localField: '_id',
                        foreignField: 'modelId',
                        as: 'variantYearwise',
                        pipeline: [
                            {
                                $match: { isDeleted: false }
                            },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetails',
                                    pipeline: [
                                        {
                                            $match: { isDeleted: false }
                                        },
                                        {
                                            $project: {
                                                name: 1
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: "$variantDetails" },
                            {
                                $group: {
                                    _id: '$year',
                                    variantDetails: { $push: "$variantDetails" }
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        variantYearwise: 1,
                    }
                }
            ];
            response.data = (await brandModel.aggregate($aggregate))?.[0]?.variantYearwise;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = brandModelServices;