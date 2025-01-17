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
}

module.exports = controller;