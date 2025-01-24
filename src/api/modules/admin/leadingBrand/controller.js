const {uploadFileToS3}  = require('../../../../utilities/utils')
const leadingBrand = require('../../../../models/leadingBrand')
class Controller {
    static async save(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "No files uploaded" });
            }

            const { file_name } = req.body;

            // Upload all files and store URLs
                    const a = uploadFileToS3(files.req,"toyo")

            res.json({
                message: "Files uploaded successfully",
                data: a
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({message: error.message});
        }
    }
static async detail(req,res){
    const data = await leadingBrand.find()
    res.json({
        status_code: true,
        data : data
    })
}}

module.exports = Controller;
