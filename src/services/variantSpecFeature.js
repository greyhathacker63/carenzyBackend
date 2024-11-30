const { Types } = require("mongoose");
const variantSpecFeatureModel = require('../models/variantSpecFeature');
const brandModelModel = require('../models/brandModel');
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");
class variantSpecFeatureServices {

    static async details(data) {
        const response = { data: {}, status: false };
        try {
            response.data = await variantSpecFeatureModel.find({
                brandId: Types.ObjectId(data.brandId),
                modelId: Types.ObjectId(data.modelId),
                variantId: Types.ObjectId(data.variantId),
                year: data.year
                // fuelTypeId: Types.ObjectId(data.fuelTypeId),
                // engineTypeId: Types.ObjectId(data.engineTypeId),
            })
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, total: ((query.total) || (query.limit * query.page)), isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                // title: { '$regex': new RegExp(query.key || ''), $options: 'i' },
                // subMasterId: query.subMasterId ? Array.isArray(query.subMasterId) ? { $in: query.subMasterId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.subMasterId) : '',
                brandId: query?.brandId ? Types.ObjectId(query.brandId) : '',
                modelId: query?.modelId ? Types.ObjectId(query.modelId) : '',
                variantId: query?.variantId ? Types.ObjectId(query.variantId) : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'variant_spec_features',
                        localField: '_id',
                        foreignField: 'modelId',
                        as: 'children',
                        pipeline: [
                            { $match: search },
                            { $sort: { _id: -1 } },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetails',
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: 'fuel_types',
                                                localField: 'fuelTypeId',
                                                foreignField: '_id',
                                                as: 'fuelTypeDetails',
                                                pipeline: [
                                                    {
                                                        $project: {
                                                            name: '$name',
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        { $unwind: { path: '$fuelTypeDetails', preserveNullAndEmptyArrays: true } },
                                        {
                                            $project: {
                                                name: '$name',
                                                fuelTypeDetails: 1
                                            }
                                        },
                                    ]
                                }
                            },
                            { $unwind: { path: '$variantDetails' } },
                            {
                                $lookup: {
                                    from: 'body_types',
                                    localField: 'bodyTypeId',
                                    foreignField: '_id',
                                    as: 'bodyTypeDetails',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$bodyTypeDetails', preserveNullAndEmptyArrays: true } },
                            {
                                $group:
                                {
                                    _id: "$variantDetails",
                                    children: {
                                        $addToSet: {
                                            name: "$name",
                                            price: "$price",
                                            year: "$year",
                                            bodyTypeName: "$bodyTypeDetails.name",
                                            fuelTypeName: "$variantDetails.fuelTypeDetails.name",
                                            allKeys: {
                                                _id: "$_id",
                                                brandId: "$brandId",
                                                modelId: "$modelId",
                                                variantId: "$variantId",
                                                fuelTypeId: "$fuelTypeId",
                                                bodyTypeId: "$bodyTypeId",
                                                masterIds: "$masterIds",
                                                description: "$description",
                                                year: "$year",
                                                price: "$price",
                                                charge: "$charge",
                                                bhp: "$bhp",
                                                milage: "$milage",
                                                enginePower: "$enginePower",
                                                engineTypeId: "$engineTypeId",
                                                waitingPeriod: "$waitingPeriod",
                                                status: { $cond: ["$status", "$status", false] },
                                            }
                                        }
                                    },
                                }
                            },
                            {
                                $project: {
                                    name: '$name',
                                    price: 1,
                                    year: 1,
                                    variantDetails: 1,
                                    children: "$children",
                                    // variantName: "$variantDetails.name",
                                    bodyTypeName: "$bodyTypeDetails.name",
                                    fuelTypeName: "$variantDetails.fuelTypeDetails.name",
                                    waitingPeriod: 1,
                                    engineTypeId: 1
                                }
                            }
                        ]
                    }
                },
                // { $unwind: { path: '$children', preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brandDetails',
                        pipeline: [
                            {
                                $project: {
                                    name: '$name',
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: '$brandDetails' } },
                {
                    $lookup: {
                        from: 'body_types',
                        localField: 'bodyTypeId',
                        foreignField: '_id',
                        as: 'bodyTypes',
                        pipeline: [
                            {
                                $project: {
                                    name: '$name',
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
                        as: 'fuelTypes',
                        pipeline: [
                            {
                                $project: {
                                    name: '$name',
                                }
                            }
                        ]
                    }
                },
                { $match: { "children.0": { $exists: true } } },
                {
                    $project: {
                        brandName: "$brandDetails.name",
                        children: 1,
                        modelName: "$name",
                        price: 1,
                        fuelType: "$fuelDetail.name",
                        bodyTypeNames: "$bodyTypes.name",
                        fuelTypeNames: "$fuelTypes.name",
                    }
                },
            ];

            if (query.onlyTotal) {
                response.extra.page = 0;
                response.extra.limit = 0;
                response.extra.total = (await brandModelModel.aggregate([...$aggregate, { $count: "total" }]))?.[0]?.total || 0;
            } else {
                response = await paginationAggregate(brandModelModel, $aggregate, $extra);
            }
            // response = await paginationAggregate(brandModelModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async save(data) {
        const response = { data: {}, status: false };
        try {
            let docData = await variantSpecFeatureModel.findOne({ brandId: data?.brandId, modelId: data?.modelId, variantId: data?.variantId, fuelTypeId: data?.fuelTypeId, engineTypeId: data?.engineTypeId })
            if (!docData) {
                docData = new variantSpecFeatureModel();
            }
            docData.brandId = data.brandId;
            docData.modelId = data.modelId;
            docData.variantId = data.variantId;
            docData.year = data.year;
            // docData.engineTypeId = data.engineTypeId;
            docData.masterIds = data.masterIds;
            docData.waitingPeriod = parseInt(data.waitingPeriod);
            docData.description = data.description;
            docData.price = data.price;
            docData.milage = data.milage;
            docData.enginePower = data.enginePower;
            docData.bhp = data.bhp;
            docData.charge = data.charge;
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
                await variantSpecFeatureModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await variantSpecFeatureModel.updateOne({ _id: ids }, { isDeleted: true });
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
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                modelId: query.modelId ? Array.isArray(query.modelId) ? { $in: query.modelId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.modelId) : '',
                variantId: query.variantId ? Array.isArray(query.variantId) ? { $in: query.variantId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.variantId) : '',
                year: query.year ? query.year : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'model_variants',
                        localField: 'variantId',
                        foreignField: '_id',
                        as: 'variantDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false, status: true }
                            },
                            {
                                $lookup: {
                                    from: 'fuel_types',
                                    localField: 'fuelTypeId',
                                    foreignField: '_id',
                                    as: 'fuelTypeDetails',
                                    pipeline: [
                                        {
                                            $match: { isDeleted: false }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$fuelTypeDetails", preserveNullAndEmptyArrays: false } },
                        ]
                    }
                },
                { $unwind: { path: "$variantDetails", preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: 'body_types',
                        localField: 'bodyTypeId',
                        foreignField: '_id',
                        as: 'bodyTypeDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$bodyTypeDetails", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'masters',
                        localField: 'masterIds._id',
                        foreignField: '_id',
                        as: 'masterDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false }
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
                        from: 'sub_masters',
                        localField: 'masterIds.subMasterIds._id',
                        foreignField: '_id',
                        as: 'subMasterDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false }
                            },
                            {
                                $project: {
                                    name: 1,
                                    masterId: 1,
                                    dataType: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'sub_master_datas',
                        localField: 'masterIds.subMasterIds.subMasterDataIds._id',
                        foreignField: '_id',
                        as: 'subMasterDataDetails',
                        pipeline: [
                            {
                                $match: { isDeleted: false }
                            },
                            {
                                $project: {
                                    title: 1,
                                    masterId: 1,
                                    subMasterId: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        masterDetails: 1,
                        subMasterDetails: 1,
                        subMasterDataDetails: 1,
                        variant: "$variantDetails.name",
                        fuelType: "$variantDetails.fuelTypeDetails.name",
                        fuelTypeId: "$variantDetails.fuelTypeDetails._id",
                        bodyType: "$bodyTypeDetails.name",
                        price: 1,
                        charge: 1,
                        year: "$variantDetails.year",
                        waitingPeriod: {
                            $cond: [
                                "$waitingPeriod",
                                {
                                    $concat: [
                                        { $toString: "$waitingPeriod" },
                                        " months waiting"
                                    ]
                                },
                                "No waiting"
                            ]
                        },
                        versionName: { $concat: ["$variantDetails.name", ", ", "$fuelTypeDetails.name", ", ", "$bodyTypeDetails.name",] }
                    }
                },
            ];

            let { data } = await paginationAggregate(variantSpecFeatureModel, $aggregate, $extra);

            data.map(v => {
                v.subMasterDetails = v.subMasterDetails.map(subMaster => {
                    return {
                        ...subMaster,
                        subMasterData: v.subMasterDataDetails.filter(subMasterData => subMaster._id.toString() === subMasterData.subMasterId.toString())
                    }
                });

                v.specFeature = v.masterDetails.map(master => {
                    return {
                        ...master,
                        subMaster: v.subMasterDetails.filter(subMaster => master._id.toString() === subMaster.masterId.toString())
                    };
                })
            })
            response.data = data;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = variantSpecFeatureServices;