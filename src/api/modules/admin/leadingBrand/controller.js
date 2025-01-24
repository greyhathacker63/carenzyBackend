const { uploadFileToS3 } = require('../../../../utilities/utils');
const leadingBrand = require('../../../../models/leadingBrand');

class Controller {
    static async save(req, res) {
        try {
            const { name } = req.body
            // if (!name) {
            //     return res.json({
            //         status_code: false,
            //         message: "Please provide name",
            //         data: {}
            //     })
            // }
            if (!req.file) {
                return res.json({
                    status_code: false,
                    message: "No file uploaded",
                    data: {}
                });
            }
            const fileUrl = await uploadFileToS3(req.file, "toyo");
            const createLeaderBrand = await leadingBrand.create({ logo: fileUrl, name: name })

            res.json({
                status_code: true,
                message: "File uploaded successfully",
                data: createLeaderBrand
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.json({
                status_code: false,
                message: error.message,
                data: {}
            });
        }
    }

    static async detail(req, res) {
        try {
            const data = await leadingBrand.find();
            res.json({
                status_code: true,
                data: data
            });
        } catch (error) {
            console.error("Detail fetch error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller;
