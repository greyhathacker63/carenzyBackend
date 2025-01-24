const { uploadFileToS3 } = require('../../../../utilities/utils');
const leadingBrand = require('../../../../models/leadingBrand');

class Controller {
    static async save(req, res) {
        try {
            const { name } = req.body
            if (!name) {
                return res.json({
                    status_code: false,
                    message: "Please provide name",
                    data: {}
                })
            }
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
            let { _id, page = 1, limit = 20 } = req.query;
            page = Math.max(1, Number(page));
            limit = Math.max(1, Number(limit));
    
            const filter = {};
            if (_id) {
                const { ObjectId } = require('mongodb');
                filter._id = new ObjectId(_id);
            }
    
            const data = await leadingBrand.aggregate([
                { $match: filter },
                {
                    $facet: {
                        paginatedData: [
                            { $sort: { createdAt: -1 } },
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ],
                        total: [
                            { $count: "total" }
                        ]
                    }
                }
            ]);
    
            const entries = data[0]?.total[0]?.total || 0;
            const paginated = data[0]?.paginatedData || [];
    
            res.json({
                status_code: true,
                message: "Data fetched successfully",
                total: entries,
                data: paginated
            });
        } catch (error) {
            res.json({ 
                status_code: false,
                message: error.message,
                total: 0,
                data: []
        })
    }
    
}
}

module.exports = Controller;
