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

            if (!_id || !ObjectId.isValid(_id)) {
                return res.json({
                    status_code: false,
                    message: "Invalid or missing _id",
                    data: [],
                    total: 0
                });
            }
            const filter ={}
            if(_id){
                filter.user_id= new ObjectId(_id) 
            }

            const userData = await sellCar.aggregate([
                {
                    $match: filter
                },
                {
                    $facet: {
                        paginatedData: [
                            { $sort: { createdAt: -1 } },
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
                total
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
