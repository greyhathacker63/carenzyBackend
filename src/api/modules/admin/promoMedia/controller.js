const Message = require('../../../../utilities/Message');
const promoMedia = require('../../../../models/promoMedia');

class Controller {
    static async create(req, res) {
        try {
            const { name, state_name, url, description } = req.body;

            const requiredFields = { name, state_name, url, description };
            const missingFields = Object.keys(requiredFields).filter((key) => !requiredFields[key]);

            if (missingFields.length) {
                return res.json({
                    status_code: false,
                    message: `Please provide ${missingFields.join(', ')}`,
                });
            }

            const createdPromo = await promoMedia.create(requiredFields);

            return res.json({
                status_code: true,
                message: 'Promo created successfully',
                data: createdPromo,
            });
        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message || 'Internal Server Error',
                data: [],
            });
        }
    }
}

module.exports = Controller;
