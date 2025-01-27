const testimonialService = require('../../../../services/testimonial');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const Testimonial = require('../../../../models/testimonial');
const { type } = require('../../../../config/firebase-dealer-app');

class controller {

	static async save(req, res) {
		const { userId, url, description, type, thumbnail } = req.body;

		const missingFields = ["userId", "url", "description", "type", "thumbnail"].filter(
			(field) => !req.body[field]
		);
		if (missingFields.length > 0) {
			return res.json({
				status_code: false,
				message: `Please provide ${missingFields.join(', ')}`,
				data: {}
			});
		}

		try {
			const createTestimonial = await Testimonial.create({
				userId,
				url,
				description,
				type,
				thumbnail
			});

			res.json({
				status_code: true,
				message: "Testimonial created successfully",
				data: createTestimonial
			});
		} catch (err) {
			res.json({
				status_code: false,
				message: err.message,
				data: {}
			});
		}
	}

	static async list(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await testimonialService.list(req.query);

			if (srvRes.data.length) {
				response.data = srvRes.data;
				response.message = Message.dataFound.message;
				response.code = Message.dataFound.code;
			}

			response.extra = srvRes.extra;
			Response.success(res, response);
		} catch (err) {
			// Response.fail(res, Response.createError(Message.dataFetchingError, err));
			res.json({
				success: false,
				message: err.message,
				errors: [
					{
						msg: err.message
					}
				],
				code: 500,
				resCode: 500
			})
		}
	}

	static async update(req, res) {
		const { _id, userId, isDeleted, type, thumbnail, url } = req.body;
		if (!_id) {
			return res.json({
				status_code: false,
				message: "Please provide _id",
				data: {}
			});
		}
		try {
			const filter = {};

			if (userId) filter.userId = userId;
			if (typeof isDeleted === 'boolean') filter.isDeleted = isDeleted;
			if (type) {
				const validTypes = ["customer", "dealer"];
				if (!validTypes.includes(type)) {
					return res.json({
						status_code: false,
						message: "Please provide correct value of type",
						data: {}
					});
				}
				filter.type = type;
			}
			if (thumbnail) filter.thumbnail = thumbnail;
			if (url) filter.url = url;

			console.log("filter", filter)

			if (Object.keys(filter).length === 0) {
				return res.json({
					status_code: false,
					message: "Please provide any value to update",
					data: {}
				});
			}

			const editTestimonial = await Testimonial.findOneAndUpdate({ _id }, { $set: filter });
			if (!editTestimonial) {
				return res.json({
					status_code: false,
					message: "Please provide correct _id"
				})
			}
			res.json({
				status_code: true,
				message: "Testimonial updated",
				data: editTestimonial
			});
		} catch (error) {
			res.json({
				status_code: false,
				message: error.message,
				data: {}
			});
		}
	}

	static async delete(req, res) {
		const { _id } = req.body

		if (!_id) {
			return res.json({
				status_code: false,
				message: "Please provide _id",
				data: {}
			})
		}
		try {
			const deleteData = await Testimonial.findByIdAndDelete(_id);

			if (!deleteData) {
				return res.json({
					status_code: false,
					message: "Testimonial not found",
					data: {}
				});
			}

			res.json({
				status_code: true,
				message: "Testimonial deleted successfully",
				data: deleteData
			});
		}
		catch (error) {
			res.json({
				status_code: false,
				message: error.message,
				data: {}
			})
		}
	}
}

module.exports = controller;