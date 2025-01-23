const sellCar = require('../../../../models/sellCar');

class Controller {
    static async save(req, res) {
        try {
            const { name, city, registration_number, make, model, variant, transmission, year, fuel, expected_price, no_of_owner } = req.body;
            const requiredFields = ["name", "expected_price", "no_of_owner", "fuel", "year", "transmission", "model", "make", "registration_number", "city"];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length) {
                return res.json({
                    status_code: false,
                    message: `Missing fields: ${missingFields.join(', ')}`,
                    data:{}
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
                data:{}
            });
        }
    }

    static async list(req, res) {
        try {
            let { page = 1, limit = 20, _id } = req.query;
            const filter = { is_deleted: false };

            page = Math.max(1, parseInt(page));
            limit = Math.max(1, parseInt(limit));

            if (_id) {
                filter._id = _id;
            }

            const response = await sellCar.aggregate([
                { $match: filter },
                {
                    $facet: {
                        data: [
                            { $sort: { createdAt: -1 } },
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ],
                        total: [{ $count: 'total' }]
                    }
                }
            ]);

            let total = response[0]?.total?.[0]?.total || 0;
            let data = response[0]?.data || [];

            return res.json({
                status_code: total > 0,
                message: total > 0 ? 'Data found' : 'No data found',
                data: data,
                total: total
            });

        } catch (error) {
            return res.json({
                status_code: false,
                message:error.message,
                data: [],
                total: 0
            });
        }
    }
}

module.exports = Controller;
