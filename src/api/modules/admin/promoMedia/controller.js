const Message = require('./../../../../utilities/Message')
const promoMedia = require('../../../../models/promoMedia')
class controller {
    static async create(req, res) {
        // try {
            // const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} }
            const { name, state_name, url, description } = req.body
            const missingFields = ["name", "state_name", "url", "description"].filter((data) => !req.body[data])
            if (missingFields.length > 0) {
                return res.json({
                    status_code: false,
                    message: `Please provide ${missingFields.join(', ')}`
                })
            }
            const createdpromo = await promoMedia.create({ name, state_name, url, description })

            res.json({
                status_code: true,
                message: "Promo create succesfully",
                data: createdpromo
            })
        }
        // catch (e) {
        //     res.json({
        //         status_code: false,
        //         message: e.message,
        //         data: []
        //     })
        // }
    // }
}


module.exports = controller