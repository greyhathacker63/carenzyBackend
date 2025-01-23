const sellCar = require('../../../../models/sellCar');
const brandModel = require('../../../../models/brandModel')
const modelData = require('../../../../models/modelVariant')
const variantFeature = require('../../../../models/variantSpecFeature')

class Controller {
    static async save(req, res) {
        try {
            const { name, city, registration_number, make, model, variant, transmission, year, fuel, expected_price, no_of_owner,mobile } = req.body;
            const requiredFields = ["name", "expected_price", "no_of_owner", "fuel", "year", "transmission", "model", "make", "registration_number", "city","mobile"];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length) {
                return res.json({
                    status_code: false,
                    message: `Missing fields: ${missingFields.join(', ')}`,
                    data: {}
                });
            }

            const response = await sellCar.create(req.body);

            return res.json({
                status_code: true,
                message: 'Car details added successfully',
                data: response
            });

        } catch (error) {
            return res.json({
                status_code: false,
                message: error.message,
                data: {}
            });
        }
    }

    static async list(req, res) {
        try {
            let { page = 1, limit = 20, _id } = req.query;
    
            page = Math.max(1, parseInt(page));
            limit = Math.max(1, parseInt(limit));
    
            const errorReturn = (msg) => res.json({ status_code: false, message: msg, data: {} });
    
            if (!_id) return errorReturn("Please provide _id");
    
            const data = await sellCar.findById(_id);
            if (!data) return errorReturn("Please provide a correct _id");
    
            const [brandModelData, modelDatas, variantFeatureData] = await Promise.all([
                brandModel.findById(data.make),
                modelData.findById(data.model),
                variantFeature.findById(data.variant)
            ]);
    
            if (!brandModelData) return errorReturn("Brand model does not exist");
            if (!modelDatas) return errorReturn("Model is not found");
            if (!variantFeatureData) return errorReturn("Variant not found");
    
            const responseData = {
                ...data.toObject(),
                brand_model_name: brandModelData.name,
                model_name: modelDatas.name,
                variant_description: variantFeatureData.description
            };
    
            return res.json({ status_code: true, message: "Data found", data: responseData });
    
        } catch (error) {
            return res.json({ status_code: false, message: error.message, data: [] });
        }
    }
    

}

module.exports = Controller;
