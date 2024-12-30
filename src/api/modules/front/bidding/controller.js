const { messaging } = require('firebase-admin');
const bidding = require('../../../../models/bid');
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

class bidController {
    static async save(req, res) {
        const {
            customer_expectation,
            no_of_owners,
            work_needed_manual_report,
            state,
            rto,
            make,
            model,
            variant,
            manufacturing_date,
            registration_date,
            kms_driven,
            fuel_type,
            rc,
            loan,
            chassing_embossing,
            piece_change_if_any,
            rusting_if_any,
            engine_condition,
            steering_suspension,
            ac,
            tyres,
            Keys,
            spare_tyre,
            painted,
            insurance,
            insurance_validity,
            transmission_type,
            transmission,
        } = req.body;

        const requiredFields = [
            'customer_expectation', 'no_of_owners', 'work_needed_manual_report',
            'state', 'rto', 'make', 'model', 'variant', 'manufacturing_date',
            'registration_date', 'kms_driven', 'fuel_type', 'rc', 'loan',
            'chassing_embossing', 'piece_change_if_any', 'rusting_if_any',
            'engine_condition', 'steering_suspension', 'ac', 'tyres', 'Keys',
            'spare_tyre', 'painted', 'insurance', 'insurance_validity',
            'transmission_type', 'transmission'
        ];
        const missingFields = requiredFields.filter((field) => !req.body[field]);

        if (missingFields.length > 0) {
            return res.json({
                status_code: false,
                message: `Please provide ${missingFields.join(', ')}`,
            });
        }

        try {
            const createdForm = await bidding.create({
                customer_expectation,
                no_of_owners,
                work_needed_manual_report,
                state,
                rto,
                make,
                model,
                variant,
                manufacturing_date,
                registration_date,
                kms_driven,
                fuel_type,
                rc,
                loan,
                chassing_embossing,
                piece_change_if_any,
                rusting_if_any,
                engine_condition,
                steering_suspension,
                ac,
                tyres,
                Keys,
                spare_tyre,
                painted,
                insurance,
                insurance_validity,
                transmission_type,
                transmission,
            });

            return res.json({
                status_code: true,
                message: 'Form is created',
                data: createdForm,
            });
        } catch (error) {
            return res.json({
                status_code: false,
                message: `Failed to create form:  + ${error.message}`,
                data: {},
            });
        }
    }
    static async detail(req, res) {
        try {
            let { _id, page = 1, limit = 20 } = req.query
            page = Number(page)
            limit = Number(limit)
            const filter = _id ? { _id: ObjectId(_id) } : {}

            const allBidding = await bidding.aggregate([
                {
                    $match: filter
                },
                {
                    $facet: {
                        total: [
                            { $count: "count" }
                        ],
                        paginatedData: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ]
                    }
                }
            ]);
            const total_length = allBidding[0]?.total[0]?.count || 0;
            const data = allBidding[0]?.paginatedData || [];

            res.json({
                status_code: data.length > 0,
                message: data.length > 0 ? "Biddding fetched sucessfully" : "No bidding exists",
                data: data,
                total: total_length
            })
        }
        catch (error) {
            res.json({
                status_code: false,
                message: `Internal server error: ${error.message}`,
                data: []
            })
        }
    }
    static async edit(req, res) {
        try {
            const { _id, ...update } = req.body;

            if (!_id) {
                return res.json({
                    status_code: false,
                    message: "Please provide _id",
                    data: {},
                });
            }

            if (!Object.keys(update).length) {
                return res.json({
                    status_code: false,
                    message: "Please provide at least one field to update",
                    data: {},
                });
            }

            const updatedData = await bidding.findByIdAndUpdate(
                _id,
                { $set: update },
                { new: true }
            );

            if (!updatedData) {
                return res.json({
                    status_code: false,
                    message: "Invalid _id provided",
                    data: {},
                });
            }

            res.json({
                status_code: true,
                message: "Data updated successfully",
                data: updatedData,
            });
        } catch (error) {
            res.json({
                status_code: false,
                message: `An error occurred while updating data ${error.message}`,
                data: {},
            });
        }
    }

}

module.exports = bidController;
