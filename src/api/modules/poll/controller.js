const Poll = require('../../../models/poll'); 

class PollController {
    static async save(req, res) {
        try {
            const { question, answer } = req.body;
            if(!Array.isArray(answer)){
                return res.json({
                    status_code:false,
                    message: "Please provide answers in a array",
                    data:{}
                })
            }

            const missingFields = ["answer", "question"].filter((field) => !req.body[field]);
            if (missingFields.length > 0) {
                return res.json({
                    status_code: false,
                    message: `Please provide ${missingFields.join(', ')}`,
                    data: {}
                });
            }

            const createdPoll = await Poll.create({ user_id, question, answer });

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
}

module.exports = PollController;