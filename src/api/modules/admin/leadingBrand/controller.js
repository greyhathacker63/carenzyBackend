const { validationResult } = require('express-validator');
const { uploadFileToS3, deleteFileFromS3 } = require('../../../../utilities/utils');
const leadingBrand = require('../../../../models/leadingBrand');

class Controller {
    static async save(req, res) {
        try {
            const { name, file } = req.body
            if (!name) {
                return res.json({
                    status_code: false,
                    message: "Please provide name",
                    data: {}
                })
            }
            // if (!req.file) {
            //     return res.json({
            //         status_code: false,
            //         message: "No file uploaded",
            //         data: {}
            //     });
            // }
            // const fileUrl = await uploadFileToS3(req.file, "toyo");
            const createLeaderBrand = await leadingBrand.create({ logo: file, name: name })

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

    //     static async edit(req, res)=>{
    //     const { _id } = req.body
    //     if (!_id) {
    //         return res.json({
    //             status_code: false,
    //             message: "Please provide _id"
    //         })
    //     }

    // }

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
    // static async delete(req,res){
    //     const {url}= req.body

    //     if(!url){
    //         return res.json({
    //             status_code: false,
    //             message: "please provide url"
    //         })
    //     }
    // }

    static async delete(req, res) {
        try {
            const { fileName } = req.body;
            if (!fileName) {
                return res.json({
                    status_code: false,
                    message: "File name is required"
                });
            }

            const result = await deleteFileFromS3(fileName);
            await leadingBrand.deleteOne({ name: fileName })
            res.json({
                status_code: true,
                message: `${fileName} is deleted sucessfully`
            });
        } catch (error) {
            res.json({
                status_code: false,
                message: error.message
            });
        }
    }

    
    
    static async edit(req, res) {
        const MESSAGES = {
            ID_REQUIRED: "Please provide _id",
            IS_ACTIVE_INVALID: "Please provide is_active as either true or false",
            BRAND_NOT_FOUND: "Brand not found",
            BRAND_UPDATED: "Brand updated successfully",
        };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                status_code: false,
                message: errors.array()[0].msg,
                data: {}
            });
        }
    
        const { _id, is_active } = req.body;
    
        if (!_id) {
            return res.json({
                status_code: false,
                message: MESSAGES.ID_REQUIRED,
                data: {}
            });
        }
    
        if (typeof is_active !== 'boolean') {
            return res.json({
                status_code: false,
                message: MESSAGES.IS_ACTIVE_INVALID,
                data: {}
            });
        }
    
        try {
            const updatedBrand = await leadingBrand.findByIdAndUpdate(
                _id,
                { $set: { is_active } },
                { new: true }
            );
    
            if (!updatedBrand) {
                return res.status(404).json({
                    status_code: false,
                    message: MESSAGES.BRAND_NOT_FOUND,
                    data: {}
                });
            }
    
            return res.json({
                status_code: true,
                message: MESSAGES.BRAND_UPDATED,
                data: updatedBrand
            });
        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message,
                data: {}
            });
        }
    }
}

module.exports = Controller;
