const { Types } = require("mongoose");
const biddingLiveModel = require("../models/bidding_live");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");
const biddingModel = require("../models/bidding");

class biddingLiveServices {
    static async detailsUsingId(query = {}) {
        const response = { data: {}, status: false };
        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : "",
            };

            clearSearch(search);
            const $aggregate = [
                { $match: search },
                {
                    $lookup: {
                        from: "dealer_cars",
                        localField: "dealerCarId",
                        foreignField: "_id",
                        as: "dealerDetails",
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'brands',
                                    localField: 'brandId',
                                    foreignField: '_id',
                                    as: 'brandDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$brandDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'brand_models',
                                    localField: 'modelId',
                                    foreignField: '_id',
                                    as: 'modelDetails',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$variantDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'fuel_types',
                                    localField: 'fuelTypeId',
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
                            {
                                $lookup: {
                                    from: 'states',
                                    localField: 'stateId',
                                    foreignField: '_id',
                                    as: 'stateDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$stateDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'cities',
                                    localField: 'cityId',
                                    foreignField: '_id',
                                    as: 'cityDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$cityDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'rtos',
                                    localField: 'rtoId',
                                    foreignField: '_id',
                                    as: 'rtoDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$rtoDetail', preserveNullAndEmptyArrays: false } },
                            {
                                $lookup: {
                                    from: 'dealer_car_likes',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'likesDetails',
                                    pipeline: [
                                        {
                                            $group: {
                                                _id: "$dealerCarId",
                                                likesCount: { $sum: 1 },
                                            },
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$likesDetails", preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'dealer_car_likes',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
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
                                    from: 'dealer_car_bookmarks',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
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
                                    from: 'colors',
                                    localField: 'colorId',
                                    foreignField: '_id',
                                    as: 'colorDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$colorDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    brandName: "$brandDetail.name",
                                    modelName: "$modelDetails.name",
                                    variantName: "$variantDetail.name",
                                    fuelTypes: "$fuelTypes.name",
                                    stateName: "$stateDetail.name",
                                    cityName: "$cityDetail.name",
                                    rtoName: "$rtoDetail.name",
                                    colorName: "$colorDetail.name",
                                    kmsDriven: 1,
                                    registrationNumberMasked: {
                                        $concat: [
                                            {
                                                $substr: [
                                                    { $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
                                                    0,
                                                    5
                                                ]
                                            },
                                            "XXXX"
                                        ],
                                    },
                                    registrationNumber: { $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
                                    ownershipType: 1,
                                    askingPrice: 1,
                                    information: 1,
                                    thumbnailImage: 1,
                                    exteriorImageVideos: 1,
                                    interiorImageVideos: 1,
                                    engineImageVideos: 1,
                                    numberOfOwners: 1,
                                    kmsDriven: 1,
                                    transmissionType: 1,
                                    insuranceType: 1,
                                    bonusNotClaimed: 1,
                                    bonusNotClaimedPercentage: 1,
                                    underHypothecation: 1,
                                    keys: 1,
                                    manufacturingYear: 1,
                                    manufacturingMonth: 1,
                                    registrationYear: 1,
                                    registrationMonth: 1,
                                    insuranceExpiryMonth: 1,
                                    insuranceExpiryYear: 1,
                                    ownershipType: 1,
                                    rcAvailibity: 1,
                                    rcImages: 1,
                                    chassisNumber: 1,
                                    chassisImages: 1,
                                    chassisNumberEmbossing: 1,
                                    insuranceImages: 1,
                                    additionalPhotos: 1,
                                    additionInformation: 1,
                                    likeCount: {
                                        $cond: ["$likesDetails", "$likesDetails.likesCount", 0]
                                    },
                                    liked: {
                                        $cond: [{ $size: "$ifDealerLiked" }, true, false]
                                    },
                                    bookmarked: {
                                        $cond: [{ $size: "$ifDealerBookmarked" }, true, false]
                                    },
                                    isOwner: {
                                        $cond: [
                                            { $eq: ["$dealerId", query.dealerId] },
                                            true,
                                            false
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            ];
            response.data = (await biddingLiveModel.aggregate($aggregate))?.[0];
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async detailsByBiddingId(liveBiddingId) {
        const response = { data: {}, status: false };
        try {
            liveBiddingId = Types.ObjectId(liveBiddingId);
            response.data = await biddingLiveModel.findOne({ _id: liveBiddingId });
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
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
            ];
            response = await paginationAggregate(biddingLiveModel, $aggregate, $extra);
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
            const docData = _id ? await biddingLiveModel.findOne({ dealerCarId: Types.ObjectId(_id) }) : new biddingLiveModel();
            docData.startTime = data.startTime ? data.startTime : docData.startTime;
            docData.endTime = data.endTime ? data.endTime : docData.endTime;
            docData.lastBid = data.lastBid ? data.lastBid : 0;
            docData.dealerCarId = data.dealerCarId ? data.dealerCarId : docData.dealerCarId;
            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async updateLastBid(data) {
        const response = { data: {}, status: false };
        try {
            const docData = await biddingLiveModel.findOne({ dealerCarId: Types.ObjectId(data.dealerCarId) });
            docData.lastBid = data.lastBid;
            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listLiveAdmin(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                endTime: query.endTime && query.ignoreInList != "1" ? { $gt: query.endTime } : "",
            };

            clearSearch(search);

            const searchDealer = {
                dealerId: query.dealerId ? Array.isArray(query.dealerId) ? { $in: query.dealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
                // type: { $elemMatch: { $in: ["Bidding", "Market"] } },
                status: query.status ? Array.isArray(query.status) ? { $in: query.status } : query.status : 'In List',
            };

            clearSearch(searchDealer);


            const $aggregate = [
                { $match: search },
                {
                    $lookup: {
                        from: 'dealer_cars',
                        localField: 'dealerCarId',
                        foreignField: '_id',
                        as: 'biddingCarDetails',
                        pipeline: [
                            { $match: searchDealer },
                            {
                                $lookup: {
                                    from: "dealers",
                                    localField: "dealerId",
                                    foreignField: "_id",
                                    as: "dealerDetails",
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: "states",
                                                localField: "stateId",
                                                foreignField: "_id",
                                                as: "stateDetails",
                                                pipeline: [
                                                    {
                                                        $project: {
                                                            name: 1,
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        { $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: true } },
                                        {
                                            $project: {
                                                name: 1,
                                                avatar: 1,
                                                location: "$stateDetails.name"
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$dealerDetails" } },
                            {
                                $lookup: {
                                    from: 'brands',
                                    localField: 'brandId',
                                    foreignField: '_id',
                                    as: 'brandDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$brandDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'brand_models',
                                    localField: 'modelId',
                                    foreignField: '_id',
                                    as: 'modelDetails',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$variantDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'fuel_types',
                                    localField: 'fuelTypeId',
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
                            {
                                $lookup: {
                                    from: 'cities',
                                    localField: 'cityId',
                                    foreignField: '_id',
                                    as: 'cityDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$cityDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'dealer_car_likes',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'likesDetails',
                                    pipeline: [
                                        {
                                            $group: {
                                                _id: "$dealerCarId",
                                                likesCount: { $sum: 1 },
                                            },
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$likesDetails", preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'dealer_car_likes',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'ifDealerLiked',
                                    pipeline: [
                                        {
                                            $match: {
                                                dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                $lookup: {
                                    from: 'dealer_car_bookmarks',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'ifDealerBookmarked',
                                    pipeline: [
                                        {
                                            $match: {
                                                dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                $project: {
                                    biddingIncGap: 1,
                                    brandName: "$brandDetail.name",
                                    modelName: "$modelDetails.name",
                                    variantName: "$variantDetail.name",
                                    fuelTypes: "$fuelTypes.name",
                                    cityName: "$cityDetail.name",
                                    kmsDriven: 1,
                                    registrationNumber: {
                                        $concat: [
                                            {
                                                $substr: [
                                                    { $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
                                                    0,
                                                    5
                                                ]
                                            },
                                            "XXXX"
                                        ],
                                    },
                                    ownershipType: 1,
                                    askingPrice: 1,
                                    information: 1,
                                    thumbnailImage: 1,
                                    exteriorImageVideos: 1,
                                    interiorImageVideos: 1,
                                    likeCount: {
                                        $cond: ["$likesDetails", "$likesDetails.likesCount", 0]
                                    },
                                    liked: {
                                        $cond: [{ $size: "$ifDealerLiked" }, true, false]
                                    },
                                    bookmarked: {
                                        $cond: [{ $size: "$ifDealerBookmarked" }, true, false]
                                    },
                                    isOwner: {
                                        $cond: [
                                            { $eq: ["$dealerId", query.requestingDealerId] },
                                            true,
                                            false
                                        ]
                                    },
                                    status: 1,
                                    dealerDetails: 1,
                                    manufacturingYear: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$biddingCarDetails", preserveNullAndEmptyArrays: false } },
                {
                    $project: {
                        startTime: 1,
                        endTime: 1,
                        lastBid: 1,
                        // biddingCarDetails: 1,
                        dealerCarId: "$biddingCarDetails._id",
                        thumbnailImage: "$biddingCarDetails.thumbnailImage",
                        interiorImageVideos: "$biddingCarDetails.interiorImageVideos",
                        exteriorImageVideos: "$biddingCarDetails.exteriorImageVideos",
                        ownershipType: "$biddingCarDetails.ownershipType",
                        status: "$biddingCarDetails.status",
                        information: "$biddingCarDetails.information",
                        askingPrice: "$biddingCarDetails.askingPrice",
                        manufacturingYear: "$biddingCarDetails.manufacturingYear",
                        kmsDriven: "$biddingCarDetails.kmsDriven",
                        dealerDetails: "$biddingCarDetails.dealerDetails",
                        brandName: "$biddingCarDetails.brandName",
                        modelName: "$biddingCarDetails.modelName",
                        variantName: "$biddingCarDetails.variantName",
                        fuelTypes: "$biddingCarDetails.fuelTypes",
                        cityName: "$biddingCarDetails.cityName",
                        registrationNumber: "$biddingCarDetails.registrationNumber",
                        biddingIncGap: "$biddingCarDetails.biddingIncGap",
                        likeCount: "$biddingCarDetails.likeCount",
                        liked: "$biddingCarDetails.liked",
                        bookmarked: "$biddingCarDetails.bookmarked",
                        isOwner: "$biddingCarDetails.isOwner"
                    }
                }
            ];
            response = await paginationAggregate(biddingLiveModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listLive(query = {}) {
        const $extra = { page: query.page, limit: query.limit, total: query.total || 47, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                endTime: query.endTime && query.ignoreInList != "1" ? { $gt: query.endTime } : "",
            };

            const searchDealer = {
                _id: (query.dealerCarId && query.dealerCarId != "NA") ? Types.ObjectId(query.dealerCarId) : "",
                dealerId: query.dealerId ? Array.isArray(query.dealerId) ? { $in: query.dealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
                status: query.status ? Array.isArray(query.status) ? { $in: query.status } : query.status : 'In List',
                brandId: (query.brandId && query.brandId != "NA") ? Array.isArray(query.brandId) ? { $in: query.brandId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.brandId) : '',
                modelId: (query.modelId && query.modelId != "NA") ? Array.isArray(query.modelId) ? { $in: query.modelId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.modelId) : '',
                variantId: (query.variantId && query.variantId != "NA") ? Array.isArray(query.variantId) ? { $in: query.variantId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.variantId) : '',
                rtoId: (query.rtoId && query.rtoId != "NA") ? Array.isArray(query.rtoId) ? { $in: query.rtoId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.rtoId) : '',
                fuelTypeId: (query.fuelTypeId && query.fuelTypeId != "NA") ? Array.isArray(query.fuelTypeId) ? { $in: query.fuelTypeId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.fuelTypeId) : '',
                transmissionType: (query.transmissionType && query.transmissionType != "NA") ? query.transmissionType : "",
                manufacturingYear: (query.manufacturingYear && query.manufacturingYear != "NA") ? query.manufacturingYear : "",
                registrationYear: (query.registrationYear && query.registrationYear != "NA") ? query.registrationYear : "",
                numberOfOwners: (query.numberOfOwners && query.numberOfOwners != "NA") ? query.numberOfOwners * 1 : "",
                dealerId: (query.dealerId && query.dealerId != "NA") ? Array.isArray(query.dealerId) ? { $in: query.dealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.dealerId) : '',
                isDeleted: false
            };

            const searchDealerMadeBidListOnly = {
                dealerId: query.requestingDealerId ? Array.isArray(query.requestingDealerId) ? { $in: query.requestingDealerId?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.requestingDealerId) : '',
                isDeleted: false
            };

            const sortBiddingList = { _id: -1 };

            if ((query.startPrice && query.endPrice) && (query.startPrice != "NA" && query.endPrice != "NA")) {
                searchDealer.askingPrice = {
                    $lte: query.endPrice * 1,
                    $gte: query.startPrice * 1
                }
            }
            if ((query.manufacturingYearStart && query.manufacturingYearEnd) && (query.manufacturingYearStart != "NA" && query.manufacturingYearEnd != "NA")) {
                searchDealer.manufacturingYear = {
                    $gte: query.manufacturingYearStart,
                    $lte: query.manufacturingYearEnd
                }
            }
            if ((query.kmsDrivenStart && query.kmsDrivenEnd) && (query.kmsDrivenStart != "NA" && query.kmsDrivenEnd != "NA")) {
                searchDealer.kmsDriven = {
                    $gte: parseInt(query.kmsDrivenStart),
                    $lte: parseInt(query.kmsDrivenEnd)
                }
            }

            if (query.sortManufacturingYear == "1" || query.sortManufacturingYear == "-1") {
                delete sortBiddingList._id;
                sortBiddingList["manufacturingYear"] = query.sortManufacturingYear * 1;
            } else if (query.sortAddedDate == "1" || query.sortAddedDate == "-1") {
                sortBiddingList._id = query.sortAddedDate * 1;
            } else if (query.sortPrice == "1" || query.sortPrice == "-1") {
                delete sortBiddingList._id;
                sortBiddingList["askingPrice"] = query.sortPrice * 1;
            } else if (query.sortKilometerDriven == "1" || query.sortKilometerDriven == "-1") {
                delete sortBiddingList._id;
                sortBiddingList["kmsDriven"] = query.sortKilometerDriven * 1;
            }

            clearSearch(searchDealer);
            clearSearch(searchDealerMadeBidListOnly);
            clearSearch(search);
            clearSearch(sortBiddingList);

            const $aggregate = [
                { $match: search },
                {
                    $lookup: {
                        from: 'dealer_cars',
                        localField: 'dealerCarId',
                        foreignField: '_id',
                        as: 'biddingCarDetails',
                        pipeline: [
                            { $match: searchDealer },
                            {
                                $lookup: {
                                    from: "dealers",
                                    localField: "dealerId",
                                    foreignField: "_id",
                                    as: "dealerDetails",
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: "states",
                                                localField: "stateId",
                                                foreignField: "_id",
                                                as: "stateDetails",
                                                pipeline: [
                                                    {
                                                        $project: {
                                                            name: 1,
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        { $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: true } },
                                        // {
                                        //     $lookup: {
                                        //         from: "rtos",
                                        //         localField: "rtoId",
                                        //         foreignField: "_id",
                                        //         as: "rtoDetails",
                                        //         pipeline: [
                                        //             {
                                        //                 $project: {
                                        //                     name: 1,
                                        //                 }
                                        //             }
                                        //         ]
                                        //     }
                                        // },
                                        // { $unwind: { path: "$rtoDetails", preserveNullAndEmptyArrays: true } },
                                        {
                                            $project: {
                                                name: { $cond: ["$dealershipName", "$dealershipName", "Carenzy Dealer"] },
                                                avatar: { $cond: ["$avatar", "$avatar", "https://admin.carenzy.com/favicon.svg"] },
                                                location: { $cond: ["$location", "$location", ""] },
                                                phone: { $first: "$phones" }
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$dealerDetails" } },
                            {
                                $lookup: {
                                    from: 'brands',
                                    localField: 'brandId',
                                    foreignField: '_id',
                                    as: 'brandDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$brandDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'brand_models',
                                    localField: 'modelId',
                                    foreignField: '_id',
                                    as: 'modelDetails',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'model_variants',
                                    localField: 'variantId',
                                    foreignField: '_id',
                                    as: 'variantDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$variantDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'fuel_types',
                                    localField: 'fuelTypeId',
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
                            {
                                $lookup: {
                                    from: 'cities',
                                    localField: 'cityId',
                                    foreignField: '_id',
                                    as: 'cityDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: '$name',
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$cityDetail', preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'dealer_car_likes',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'likesDetails',
                                    pipeline: [
                                        {
                                            $group: {
                                                _id: "$dealerCarId",
                                                likesCount: { $sum: 1 },
                                            },
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: "$likesDetails", preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: 'dealer_car_likes',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'ifDealerLiked',
                                    pipeline: [
                                        {
                                            $match: {
                                                dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                $lookup: {
                                    from: 'dealer_car_bookmarks',
                                    localField: '_id',
                                    foreignField: 'dealerCarId',
                                    as: 'ifDealerBookmarked',
                                    pipeline: [
                                        {
                                            $match: {
                                                dealerId: query?.requestingDealerId ? Types.ObjectId(query?.requestingDealerId) : ''
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                $lookup: {
                                    from: 'rtos',
                                    localField: 'rtoId',
                                    foreignField: '_id',
                                    as: 'rtoDetail',
                                    pipeline: [
                                        {
                                            $project: {
                                                name: 1,
                                                code: 1
                                            }
                                        }
                                    ]
                                }
                            },
                            { $unwind: { path: '$rtoDetail', preserveNullAndEmptyArrays: false } },
                            {
                                $project: {
                                    rtoName: { $trim: { input: "$rtoDetail.name" } },
                                    rtoCode: "$rtoDetail.code",
                                    biddingIncGap: 1,
                                    brandName: "$brandDetail.name",
                                    modelName: "$modelDetails.name",
                                    variantName: "$variantDetail.name",
                                    fuelTypes: "$fuelTypes.name",
                                    cityName: "$cityDetail.name",
                                    kmsDriven: 1,
                                    paintedPiecesCount: 1,
                                    registrationNumber: {
                                        $concat: [
                                            {
                                                $substr: [
                                                    { $replaceAll: { input: '$registrationNumber', find: ' ', replacement: '' } },
                                                    0,
                                                    5
                                                ]
                                            },
                                            "XXXX"
                                        ],
                                    },
                                    ownershipType: 1,
                                    askingPrice: 1,
                                    information: 1,
                                    thumbnailImage: 1,
                                    exteriorImageVideos: 1,
                                    interiorImageVideos: 1,
                                    engineImageVideos: 1,
                                    likeCount: {
                                        $cond: ["$likesDetails", "$likesDetails.likesCount", 0]
                                    },
                                    liked: {
                                        $cond: [{ $size: "$ifDealerLiked" }, true, false]
                                    },
                                    bookmarked: {
                                        $cond: [{ $size: "$ifDealerBookmarked" }, true, false]
                                    },
                                    isOwner: {
                                        $cond: [
                                            { $eq: ["$dealerId", query.requestingDealerId] },
                                            true,
                                            false
                                        ]
                                    },
                                    dealerId: 1,
                                    status: 1,
                                    dealerDetails: 1,
                                    keys: 1,
                                    numberOfOwners: 1,
                                    manufacturingYear: 1,
                                    underHypothecation: 1,
                                    collaboration: 1,
                                    manufacturingMonth: 1,
                                    insuranceExpiryMonth: 1,
                                    insuranceExpiryYear: 1,
                                    registrationMonth: 1,
                                    registrationYear: 1,
                                    insuranceType: 1,
                                    bonusNotClaimed: 1,
                                    bonusNotClaimedPercentage: 1,
                                    transmissionType: 1,
                                    rcAvailibity: 1,
                                    chassisNumber: 1,
                                    chassisNumberEmbossing: 1,
                                    location: { $cond: ["$location", "$location", null] },
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$biddingCarDetails", preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: 'biddings',
                        localField: '_id',
                        foreignField: 'liveBiddingId',
                        as: 'biddingList',
                        pipeline: [
                            { $match: searchDealerMadeBidListOnly },
                            { $sort: { _id: -1 } },
                            { $limit: 1 },
                            {
                                $project: {
                                    bidAmount: '$bidAmount',
                                    dealerId: 1
                                }
                            }
                        ]
                    },
                    hidden: !query.myBid
                },
                { $unwind: { path: "$biddingList", preserveNullAndEmptyArrays: query.myBid == 1 ? false : true }, hidden: !query.myBid },
                {
                    $project: {
                        myLastBid: "$biddingList.bidAmount",
                        rtoName: "$biddingCarDetails.rtoName",
                        rtoCode: "$biddingCarDetails.rtoCode",
                        startTimeIos: "$startTime",
                        endTimeIos: "$endTime",
                        startTime: {
                            $add: ["$startTime", 19800000] // 19800000 milliseconds is 5 hours and 30 minutes (IST offset)
                        },
                        endTime: {
                            $add: ["$endTime", 19800000] // 19800000 milliseconds is 5 hours and 30 minutes (IST offset)
                        },
                        lastBid: 1,
                        dealerCarId: "$biddingCarDetails._id",
                        interiorImageVideos: "$biddingCarDetails.interiorImageVideos",
                        thumbnailImage: "$biddingCarDetails.thumbnailImage",
                        exteriorImageVideos: "$biddingCarDetails.exteriorImageVideos",
                        engineImageVideos: "$biddingCarDetails.engineImageVideos",
                        ownershipType: "$biddingCarDetails.ownershipType",
                        status: "$biddingCarDetails.status",
                        information: "$biddingCarDetails.information",
                        askingPrice: "$biddingCarDetails.askingPrice",
                        manufacturingYear: "$biddingCarDetails.manufacturingYear",
                        kmsDriven: "$biddingCarDetails.kmsDriven",
                        paintedPiecesCount: "$biddingCarDetails.paintedPiecesCount",
                        dealerDetails: "$biddingCarDetails.dealerDetails",
                        brandName: "$biddingCarDetails.brandName",
                        modelName: "$biddingCarDetails.modelName",
                        variantName: "$biddingCarDetails.variantName",
                        fuelTypes: "$biddingCarDetails.fuelTypes",
                        cityName: "$biddingCarDetails.cityName",
                        registrationNumber: "$biddingCarDetails.registrationNumber",
                        biddingIncGap: "$biddingCarDetails.biddingIncGap",
                        likeCount: "$biddingCarDetails.likeCount",
                        liked: "$biddingCarDetails.liked",
                        bookmarked: "$biddingCarDetails.bookmarked",
                        isOwner: "$biddingCarDetails.isOwner",
                        keys: "$biddingCarDetails.keys",
                        numberOfOwners: "$biddingCarDetails.numberOfOwners",
                        dealerId: "$biddingCarDetails.dealerId",
                        manufacturingMonth: "$biddingCarDetails.manufacturingMonth",
                        insuranceExpiryMonth: "$biddingCarDetails.insuranceExpiryMonth",
                        insuranceExpiryYear: "$biddingCarDetails.insuranceExpiryYear",
                        registrationMonth: "$biddingCarDetails.registrationMonth",
                        registrationYear: "$biddingCarDetails.registrationYear",
                        underHypothecation: "$biddingCarDetails.underHypothecation",
                        collaboration: "$biddingCarDetails.collaboration",
                        insuranceType: "$biddingCarDetails.insuranceType",
                        bonusNotClaimed: "$biddingCarDetails.bonusNotClaimed",
                        bonusNotClaimedPercentage: "$biddingCarDetails.bonusNotClaimedPercentage",
                        transmissionType: { $cond: ["$biddingCarDetails.transmissionType", "$biddingCarDetails.transmissionType", null] },
                        rcAvailibity: "$biddingCarDetails.rcAvailibity",
                        chassisNumber: "$biddingCarDetails.chassisNumber",
                        chassisNumberEmbossing: "$biddingCarDetails.chassisNumberEmbossing",
                        liked: { $cond: [true, true, true] },
                        bookmarked: { $cond: [true, true, true] },
                        likeCount: { $cond: [true, 0, 0] },
                        location: "$biddingCarDetails.location",
                    }
                },
                { $sort: sortBiddingList, hidden: !Object.keys(sortBiddingList)?.length },
            ].filter(v => !v.hidden).map(v => { delete v.hidden; return v; });

            if (query.onlyTotal) {
                response.extra.page = 0;
                response.extra.limit = 0;
                response.extra.total = (await biddingLiveModel.aggregate([...$aggregate, { $count: "total" }]))?.[0]?.total || 0;
            } else {
                response = await paginationAggregate(biddingLiveModel, $aggregate, $extra);
            }
            // response = await paginationAggregate(biddingLiveModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async latestBid(dealerCarId) {
        // This will return us the latest bid of the particular live dealerCarId:
        const response = { data: {}, status: false };
        try {
            dealerCarId = Types.ObjectId(dealerCarId);
            const docData = await biddingLiveModel.find({ dealerCarId: dealerCarId }).sort({ timestamps: -1 })
            if (docData.length > 0) {
                response.data = docData[0];
            }
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }

    }

    static async getHighestBid(dealerCarId) {
        // This will return us the highest bid placed on the live dealerCarId:
        const response = { data: {}, status: false };
        try {
            dealerCarId = Types.ObjectId(dealerCarId);
            const docData = await biddingModel.find({ dealerCarId: dealerCarId, isDeleted: false }).sort({ bidAmount: -1 })
            if (docData.length > 0) {
                response.data = docData[0];
            }
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }

    }
    static async getAllNextBids(bidId) {
        // This will returns us all the bid after the particular Bid:
        const response = { data: {}, status: false };
        try {
            bidId = Types.ObjectId(bidId);
            // get createdAt of the bid:
            const bidDoc = await biddingModel.findOne({ _id: bidId, isDeleted: false });
            const docData = await biddingModel.find({ createdAt: { $gt: bidDoc?.createdAt }, isDeleted: false })
            response.data = docData;
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }

    }
}

module.exports = biddingLiveServices;