const Poll = require('../../../models/poll');

class PollController {
    static async save(req, res) {
        try {
            const { question, answer } = req.body;
            if (!Array.isArray(answer)) {
                return res.json({
                    status_code: false,
                    message: "Please provide answers in a array",
                    data: {}
                })
            }
            if (answer.length !== 4) {
                return res.json({
                    status_code: false,
                    message: "Please provide 4 answers",
                    data: {}
                })
            }
            const missingFields = ["answer", "question"].filter((field) => !req.body[field]);
            if (missingFields.length > 0) {
                return res.json({
                    status_code: false,
                    message: `Please provide ${missingFields.join(', ')}`,
                });
            }

            const formattedAnswers = answer.map(ans => ({ answer: ans }));

            const createdPoll = await Poll.create({ question, answers: formattedAnswers });

            res.json({
                status_code: true,
                message: "Poll is created",
                data: createdPoll,
            });
        } catch (error) {
            res.json({
                status_code: false,
                message: "An error occurred while creating the poll.",
                error: error.message,
            });
        }
    }
    static async detail(req, res) {
        try {
            let { _id, page = 1, limit = 20 } = req.query;
            page = Number(page);
            limit = Number(limit);

            if (!_id) {
                const polls = await Poll.find({ is_deleted: false })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean();

                const totalPolls = await Poll.countDocuments({ is_deleted: false });

                return res.json({
                    status_code: true,
                    message: "Polls fetched successfully",
                    data: polls,
                    pagination: {
                        total: totalPolls,
                        page,
                        limit,
                        totalPages: Math.ceil(totalPolls / limit),
                    },
                });
            }

            const poll = await Poll.findById(_id).lean();

            if (!poll) {
                return res.json({
                    status_code: false,
                    message: "Poll not found, please provide a correct _id",
                    data: null,
                });
            }

            res.json({
                status_code: true,
                message: "Poll fetched successfully",
                data: poll,
                pagination: {
                    total: poll.length,
                    page,
                    limit,
                    totalPages: Math.ceil(poll.length / limit),
                },
            });

        } catch (error) {
            res.json({
                status_code: false,
                message: error.message || "An error occurred while fetching poll data.",
                data: {},
            });
        }
    }


    static async increaseCount(req, res) {
        try {
            const { _id, ans_position } = req.body;
            const missingFields = ["_id", "ans_position"].filter((data) => !req.body[data])

            function errorFunction(status_code, message, data) {
                return res.json({
                    status_code: status_code,
                    message: message,
                    data: data
                });
            }

            if (missingFields.length > 0) {
                return errorFunction(false, `Please provide ${missingFields.join(' ')}`)
            }

            if (ans_position < 0 || ans_position >= 4) {
                return errorFunction(false, "Please provide correct poll position", {})
            }

            const poll = await Poll.findById(_id);
            if (!poll) {
                return errorFunction(false, "Poll not found, please provide correct _id", {})
            }

            const updatedCount = await Poll.updateOne(
                { _id },
                { $inc: { [`answers.${ans_position}.count`]: 1 } }
            );

            if (updatedCount.modifiedCount > 0) {
                return errorFunction(true, "Poll answer count increased successfully", updatedCount)
            } else {
                return errorFunction(false, "Failed to update answer count", {})
            }
        } catch (error) {
            res.json({
                status_code: false,
                message: error.message || "An error occurred while updating the poll",
                data: {},
            });
        }
    }

    static async edit(req, res) {
        try {
            let { _id, question, is_deleted, ans_position, answer } = req.body;
            const filter = {}

            if (is_deleted) {
                filter.is_deleted = is_deleted
            }
            if (question) {
                filter.question = question
            }
            if (answer) {
                filter[`answers.${ans_position}.answer`] = answer;
            }

            const poll = await Poll.findByIdAndUpdate(_id, { $set: filter }, { new: true })

            if (!poll) {
                return res.json({
                    status_code: false,
                    message: "Poll not found, please provide a correct _id",
                    data: null,
                });
            }

            res.json({
                status_code: true,
                message: "Poll update sucessfully",
                data: poll,
            });

        } catch (error) {
            res.json({
                status_code: false,
                message: error.message || "An error occurred while fetching poll data.",
                data: {},
            });
        }
    }


}

module.exports = PollController;
