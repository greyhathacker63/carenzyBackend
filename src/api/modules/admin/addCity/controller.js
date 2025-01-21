const addCity = require('../../../../models/addCity');
const states = require('../../../../models/state');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

class controller {
    static async save(req, res) {
        const { state, city } = req.body;

        if (!state) {
            return Response.fail(res, Response.createError(Message.validationError, 'Please provide state'));
        }

        if (!Array.isArray(city)) {
            return Response.fail(res, Response.createError(Message.validationError, 'Please provide city in array'));
        }

        // Ensure each city is an object
        const cityObjects = city.map(c => ({ name: c.toLowerCase() }));

        try {
            const existedState = await states.findOne({ isDeleted: false, name: state });

            if (!existedState) {
                return Response.fail(res, Response.createError(Message.validationError, 'Please provide correct name for state'));
            }

            const createState = await addCity.create({ state, cities: cityObjects });

            return Response.success(res, {
                message: 'Data inserted successfully',
                data: createState
            });
        } catch (err) {
            console.error('Error saving data:', err); // Log the error for debugging
            return Response.fail(res, Response.createError(Message.dataSavingError, 'An error occurred while saving data'));
        }
    }
    static async details(req, res) {
        let { state_id, page = 1, limit = 20 } = req.query;
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));
        const filter = { is_deleted: false };
        try {
            if (state_id) {
                filter._id = state_id
            }
            const cityData = await addCity.aggregate([
                {
                    $match: filter
                },
                {
                    $facet: {
                        data: [
                            { $sort: { createdAt: -1 } },
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ],
                        total: [
                            { $count: 'total' }
                        ]
                    }
                }
            ])
            const data = cityData[0]?.data || [];
            const total = cityData[0]?.total[0]?.total || 0;
            res.json({
                status_code: true,
                data,
                total
            })
        }
        catch (err) {
            res.json({
                status_code: false,
                message: err.message,
                data: [],
                total: 0
            })
        }
    }

    static async addCity(req, res) {
        const { _id, city } = req.body;
        const missingField = ["_id", "city"].filter(field => !req.body[field]);
        if (missingField.length) {
            return res.json({
                status_code: false,
                message: 'Please provide ' + missingField.join(', '),
                data: []
            })
        }

        try {
            const updateCity = await addCity.findOneAndUpdate({ _id }, { $push: { cities: { name: city } } }, { new: true });
            if (!updateCity) {
                return Response.fail(res, Response.createError(Message.validationError, 'Please provide correct state id'));
            }
            return Response.success(res, {
                message: 'Data updated successfully',
                data: updateCity
            });
        } catch (err) {
            console.error('Error updating data:', err);
            return Response.fail(res, Response.createError(Message, 'An error occurred while updating data'));
        }
    }

    static async updateCity(req, res) {
        const { _id, city_index, city } = req.body;
        const missingField = ["_id", "city_index", "city"].filter(field => !req.body[field]);
        if (missingField.length) {
            return res.json({
                status_code: false,
                message: 'Please provide ' + missingField.join(', '),
                data: []
            });
        }
        if (typeof city_index !== 'number') {
            return res.json({
                status_code: false,
                message: 'Please provide correct city index',
                data: []
            });
        }

        try {
            const update = await addCity.findOneAndUpdate(
                { _id },
                { $set: { [`cities.${city_index}.name`]: city } },
                { new: true }
            );

            if (!update) {
                return res.json({
                    status_code: false,
                    message: 'Please provide correct state id or city index',
                    data: []
                });
            }

            res.json({
                status_code: true,
                message: 'Data updated successfully',
                data: update
            });
        } catch (err) {
            console.error('Error updating data:', err);
            return res.json({
                status_code: false,
                message: 'An error occurred while updating data',
                data: []
            });
        }
    }
    static async delete(req, res) {
        const { _id, city_index } = req.body;

        // Validate required fields
        const missingField = ["_id", "city_index"].filter(field => req.body[field] === undefined);
        if (missingField.length) {
            return res.json({
                success: false,
                message: 'Please provide ' + missingField.join(', '),
                data: []
            });
        }

        // Validate city_index type
        if (typeof city_index !== 'number') {
            return res.json({
                success: false,
                message: 'Please provide a valid city index',
                data: []
            });
        }

        try {
            // Remove the specific city from the array using $unset
            const update = await addCity.updateOne(
                { _id },
                { $unset: { [`cities.${city_index}`]: 1 } }
            );

            // Shift the remaining elements left using $pull to remove null values
            await addCity.updateOne(
                { _id },
                { $pull: { cities: null } }
            );

            res.json({
                success: true,
                message: 'City deleted successfully',
                data: update
            });
        } catch (err) {
            return res.json({
                success: false,
                message: err.message,
                data: []
            });
        }
    }

    static async allCity(req, res) {
    
        try {
            const cityData = await addCity.find({ is_deleted: false });
    
            const stateSet = new Set();
            const cityMap = {};
    
            cityData.forEach(city => {
                stateSet.add(city.state);
    
                city.cities.forEach(arrayCity => {
                    const key = `${arrayCity.name[0].toLowerCase()}_cities`; // Correct variable key format
                    
                    if (!cityMap[key]) {
                        cityMap[key] = [];
                    }
                    cityMap[key].push(arrayCity.name);
                });
            });
    
            res.json({
                status_code: true,
                // data: cityData,
                states: Array.from(stateSet), // Convert Set to an array
                groupedCities: cityMap
            });
    
        } catch (err) {
            res.json({
                status_code: false,
                message: err.message,
                data: [],
                states: [],
                groupedCities: {}
            });
        }
    }
    

}
module.exports = controller;