const sellCar = require('../../../../models/sellCar');
const brandModel = require('../../../../models/brandModel')
const modelData = require('../../../../models/modelVariant')
const variantFeature = require('../../../../models/variantSpecFeature');
const dealer = require('../../../../models/dealer')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');

class Controller {
    static async save(req, res) {
        try {
            const { name, city, registration_number, make, model, variant, transmission, year, fuel, expected_price, no_of_owner, mobile, user_id } = req.body;
            const requiredFields = ["name", "expected_price", "no_of_owner", "fuel", "year", "transmission", "model", "make", "registration_number", "city", "mobile"];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length) {
                return res.json({
                    status_code: false,
                    message: `Missing fields: ${missingFields.join(', ')}`,
                    data: {}
                });
            }

            const response = await sellCar.create(req.body);

            return res.json({
                status_code: true,
                message: 'Car details added successfully',
                data: response
            });

        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message,
                data: {}
            });
        }
    }

    static async list(req, res) {
        try {
            let { page = 1, limit = 20, _id } = req.query;

            page = Math.max(1, parseInt(page, 10));
            limit = Math.max(1, parseInt(limit, 10));

            const filter = {}
            if (_id) {
                filter.user_id = new ObjectId(_id)
            }

            console.log("filter", filter)
            const userData = await sellCar.aggregate([
                {
                    $match: filter
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'make',
                        foreignField: '_id',
                        as: 'brandDetail',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
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
                        localField: 'model',
                        foreignField: '_id',
                        as: 'modelDetails',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    name: '$name',
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: '$modelDetails', preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: 'model_variants',
                        localField: 'variant',
                        foreignField: '_id',
                        as: 'variantDetail',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
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
                        localField: 'fuel',
                        foreignField: '_id',
                        as: 'fuelTypes',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    name: '$name',
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: '$fuelTypes',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $facet: {
                        paginatedData: [
                            { $sort: { createdAt: -1 } },
                            {
                                $project: {
                                    name: 1,
                                    city: 1,
                                    registration_number: 1,
                                    make: "$brandDetail.name",
                                    model: "$modelDetails.name",
                                    variant: "$variantDetail.name",
                                    transmission: 1,
                                    year: 2024,
                                    fuel: "$fuelTypes.name",
                                    user_id: 1,
                                    no_of_owner: 1,
                                    expected_price: 1,
                                    plan_to_sell: 1,
                                    image: 1,
                                    mobile: 1,
                                    is_deleted: 1,
                                    createdAt: 1,
                                    updatedAt: 1,
                                },
                            },
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ],
                        total: [{ $count: "total" }]
                    }
                }
            ]);

            const paginatedData = userData[0]?.paginatedData || [];
            const total = userData[0]?.total[0]?.total || 0;

            return res.json({
                status_code: paginatedData.length > 0,
                message: paginatedData.length > 0 ? "Data fetched successfully" : "No data found",
                data: paginatedData,
            });

        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message || "An error occurred",
                data: [],
                total: 0
            });
        }
    }

}

module.exports = Controller;
