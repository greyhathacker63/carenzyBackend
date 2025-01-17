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
        const cityObjects = city.map(c => ({ name: c }));

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
        const filter = {}
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

    static async update(req, res) {
        const { _id, city } = req.body;
        if(!_id){
            return Response.fail(res, Response.createError(Message.validationError, 'Please provide state id'));
        }
        if (!city) {
            return Response.fail(res, Response.createError(Message.validationError, 'Please provide city'));
        }
        try {
            const updateCity = await addCity.findOneAndUpdate({ _id }, { $push: { cities: { name: city } } }, { new: true });   
            if(!updateCity){
                return Response.fail(res, Response.createError(Message.validationError, 'Please provide correct state id'));
            }
            return Response.success(res, {
                message: 'Data updated successfully',
                data: updateCity
            });
    }catch (err) {
        console.error('Error updating data:', err); 
        return Response.fail(res, Response.createError(Message, 'An error occurred while updating data'));
    }
}
}
module.exports = controller;