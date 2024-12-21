const bidding = require('../../../../models/bid')

class bidController {
    static async save() {
        const { customer_expectation, no_of_owners, work_needed_manual_report, state, rto, make, model, variant, manufacturing_date, registration_date, kms_driven, fuel_type, rc, loan, chassing_embossing, piece_change_if_any, rusting_if_any, engine_condition, steering_suspension, ac, tyres, Keys, spare_tyre, painted, insurance, insurance_validity, transmission_type, transmission } = req.body
        const missingFields = ["customer_expectation", "no_of_owners", "work_needed_manual_report", "state", "rto", "make", "model", "variant", "manufacturing_date", "registration_date", "kms_driven", "fuel_type", "rc", "loan", "chassing_embossing", "piece_change_if_any", "rusting_if_any", "engine_condition", "steering_suspension", "ac", "tyres", "Keys", "spare_tyre", "painted", "insurance", "insurance_validity", "transmission_type", "transmission"].filter((data) => !req.body[data])
        if(missingFields.length>0){
            return res.json({
                status_code: false,
                message:   `Please provide ${missingFields.join(', ')}`
            })
        }
        try{
        const createdForm = await bidding.create({ customer_expectation, no_of_owners, work_needed_manual_report, state, rto, make, model, variant, manufacturing_date, registration_date, kms_driven, fuel_type, rc, loan, chassing_embossing, piece_change_if_any, rusting_if_any, engine_condition, steering_suspension, ac, tyres, Keys, spare_tyre, painted, insurance, insurance_validity, transmission_type, transmission })
        res.json({
            status_code: true,
            mesage: "Form is created",
            data: createdForm
        })
    }
    catch(error){
        return res.json({
            status_code: false,
            message: error.message,
            data: {}
        })
    }
}
}

module.exports = bidController