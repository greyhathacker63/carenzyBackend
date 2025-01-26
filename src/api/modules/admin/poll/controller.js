const Poll = require('../../../../models/poll');

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
            let { page = 1, limit = 20 } = req.query;
            page = Math.max(1, Number(page))
            limit = Math.max(1, Number(limit));

            const polls = await Poll.aggregate([
                {
                    $match: {
                        is_deleted: false
                    }
                },
                {
                    $facet: {
                        paginatedData: [
                            {
                                $sort: {
                                    updatedAt: -1
                                }
                            },
                            {
                                $skip: (page - 1) * limit
                            },
                            {
                                $limit: limit
                            },
                        ],
                        total: [
                            {
                                $count: 'total'
                            }
                        ]
                    }
                }
            ]);
            const data = polls[0]?.paginatedData
            const total = polls[0]?.total[0]?.total

            return res.json({
                status_code: total > 0,
                message: total > 0 ? "Polls fetched successfully" : "No data found",
                data: data,
                pagination: {
                    total: total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            res.json({
                status_code: false,
                message: error.message,
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
            const { _id, question, is_deleted, ans_position, answers } = req.body;

            if (!_id) {
                return res.json({
                    status_code: false,
                    message: "Please provide _id",
                    data: {},
                });
            }

            if (is_deleted !== undefined && typeof is_deleted !== "boolean") {
                return res.json({
                    status_code: false,
                    message: "Please provide is_deleted as either true or false",
                });
            }
    
            const filter = {};
            if (is_deleted !== undefined) filter.is_deleted = is_deleted;
            if (question) filter.question = question;
    

            if (Array.isArray(answers)) {
                answers.forEach(({ ans_position, answer }) => {
                    const position = Number(ans_position);
                    if (position < 0 || position > 3) {
                        return res.json({
                            status_code: false,
                            message: `Invalid ans_position: ${position}. It should be between 0 to 3.`,
                        });
                    }
                    filter[`answers.${position}.answer`] = answer;
                });
            }
    
            if (Object.keys(filter).length === 0) {
                return res.json({
                    status_code: false,
                    message: "Please provide at least one field to update",
                });
            }
    
            const poll = await Poll.findByIdAndUpdate(_id, { $set: filter }, { new: true });
    
            if (!poll) {
                return res.json({
                    status_code: false,
                    message: "Poll not found, please provide a correct _id",
                    data: {},
                });
            }
    
            res.json({
                status_code: true,
                message: "Poll updated successfully",
                data: poll,
            });
    
        } catch (error) {
            res.json({
                status_code: false,
                message: error.message || "An error occurred while updating the poll.",
                data: {},
            });
        }
    }
    
}

module.exports = PollController;
