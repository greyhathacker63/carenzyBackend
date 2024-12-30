const mongoose = require('mongoose');
const { Schema } = mongoose;

const vehicleEnum = {
    fuelTypes: ["petrol", "diesel", "cng", "ev", "hybrid"],
    rcStatuses: ["original", "copy", "lost"],
    partStatuses: ["bonnet", "dicky", "lh_fender", "lh_front_door", "lh_rear_door", "lh_quarter", "rh_fender", "rh_front_door", "rh_rear_door", "rh_quarter"],
    engineConditions: ["good", "excellent", "average", "repair"],
    steeringSuspensionConditions: ["good", "minor_noise", "major_noise"],
    acConditions: ["working", "low_gas", "need_repair"],
    insuranceTypes: ["comprehensive", "zero_dep", "third_party", "expired"],
    transmissionTypes: ["automatic", "manual"],
    spareTyreStatuses: ["used", "unused", "need_replacement"]
};

const biddingSchema = new Schema({
    customer_expectation: {
        type: Number,
    },
    state: {
        type: String,
    },
    rto: {
        tyep: String,
    },
    make: {
        type: String,
    },
    model: {
        type: String,
    },
    variant: {
        type: String,
    },
    manufacturing_date: {
        type: Date
    },
    registration_date: {
        type: Date
    },
    kms_driven: {
        type: Number
    },
    fuel_type: {
        type: String, enum: vehicleEnum.fuelTypes
    },
    rc: {
        type: String,
        enum: vehicleEnum.rcStatuses
    },
    loan: {
        type: Boolean
    },
    chassing_embossing: {
        type: String
    },
    piece_change_if_any: {
        type: String,
        enum: vehicleEnum.partStatuses
    },
    rusting_if_any: {
        type: String,
        enum: vehicleEnum.partStatuses
    },
    engine_condition: {
        type: String,
        enum: vehicleEnum.engineConditions
    },
    steering_suspension: {
        type: String,
        enum: vehicleEnum.steeringSuspensionConditions
    },
    ac: {
        type: String,
        enum: vehicleEnum.acConditions
    },
    tyres: {
        type: Number
    },
    Keys: {
        type: Number,
        enum: [1, 2]
    },
    spare_tyre: {
        type: String,
        enum: vehicleEnum.spareTyreStatuses
    },
    work_needed_manual_report: {
        type: String
    },
    painted: {
        type: String,
        enum: vehicleEnum.partStatuses
    },
    no_of_owners: {
        type: Number
    },
    insurance: {
        type: String,
        enum: vehicleEnum.insuranceTypes
    },
    insurance_validity: {
        type: Date
    },
    transmission_type: {
        type: String,
        enum: vehicleEnum.transmissionTypes
    },
    transmission: {
        type: String,
        enum: vehicleEnum.transmissionTypes
    }
<<<<<<< HEAD
},{
    timestamps: true,
    versionKey: false
=======
>>>>>>> 36113ba4ab006fdfb5ccb72b8e4d9d536c1f7e61
});

module.exports = mongoose.model("bidding_forms", biddingSchema);
