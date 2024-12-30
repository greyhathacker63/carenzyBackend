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

    static async list(req, res) {
        try {
            const { _id } = req.query;

            if (!_id) {
                return res.json({
                    status_code: false,
                    message: "Please provide _id",
                    data: {}
                });
            }

            const createdPromo = await promoMedia.findById(_id);

            if (!createdPromo) {
                return res.json({
                    status_code: false,
                    message: "Please provide a correct ID",
                    data: {}
                });
            }

            return res.json({
                status_code: true,
                message: "Promo fetched successfully",
                data: createdPromo,
            });

        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message || "Internal Server Error",
                data: {}
            });
        }
    }


    static async lists(req, res) {
        try {
            const allPromo = await promoMedia.find({ is_deleted: false });

            if (!allPromo.length) {
                return res.json({
                    status_code: false,
                    message: "No promo found",
                    data: [],
                });
            }

            return res.json({
                status_code: true,
                message: "Promo fetched successfully",
                data: allPromo,
            });

        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message || "Internal Server Error",
                data: [],
            });
        }
    }


    static async editList(req, res) {
        const { _id, name, url, state_name, description } = req.body;
        try {
            if (!_id) {
                return res.json({
                    status_code: false,
                    message: "Please provide _id for editing",
                });
            }

            const filter = {};
            if (name) filter.name = name;
            if (url) filter.url = url;
            if (state_name) filter.state_name = state_name;
            if (description) filter.description = description;

            if (Object.keys(filter).length === 0) {
                return res.json({
                    status_code: false,
                    message: "Please provide at least one field to update",
                });
            }

            const editPromo = await promoMedia.findByIdAndUpdate(_id, { $set: filter }, { new: true });

            if (!editPromo) {
                return res.json({
                    status_code: false,
                    message: "No promo found with the provided _id",
                });
            }

            return res.json({
                status_code: true,
                message: "Data updated successfully",
                data: editPromo,
            });
        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    static async removeList(req, res) {
        const { _id, is_deleted } = req.body;
        try {
            if (!_id) {
                return res.json({
                    status_code: false,
                    message: "Please provide _id for editing",
                });
            }

            const editPromo = await promoMedia.findByIdAndUpdate(_id, { $set: { is_deleted: is_deleted } }, { new: true });

            if (!editPromo) {
                return res.json({
                    status_code: false,
                    message: "No promo found with the provided _id",
                });
            }

            return res.json({
                status_code: true,
                message: "Data updated successfully",
                data: editPromo,
            });
        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

}

module.exports = Controller;
