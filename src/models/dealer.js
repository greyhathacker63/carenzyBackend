const { Schema, model, Types, } = require('mongoose');

const dealerSchema = new Schema({
    rtoId: {
        type: Types.ObjectId,
        ref: "rto"
    },
    registrationCertificateId: {
        type: Types.ObjectId,
        ref: "metadata"
    },
    phones: [
        {
            type: String,
            trim: true
        }
    ],
    stateId: {
        type: String,
        // ref: "states"
    },
    lastGeneralNotificationId: {
        type: Schema.Types.ObjectId,
        ref: "notification"
    },
    lastBidNotificationId: {
        type: Schema.Types.ObjectId,
        ref: "notification"
    },
    crz: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    dealershipName: {
        type: String,
    },
    email: {
        type: String,
        trim: true
    },
    pinCode: {
        type: String,
        trim: true
    },
    aadhaarNo: {
        type: String,
        trim: true
    },
    adharFrontImgUrl: {
        type: String,
        trim: true
    },
    adharBackImgUrl: {
        type: String,
        trim: true
    },
    panNo: {
        type: String,
        trim: true
    },
    panCardimgUrl: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    shopPhotoUrl: {
        type: String,
        trim: true
    },
    registrationCertImgUrl: {
        type: String,
        trim: true
    },
    gstNo: {
        type: String,
        trim: true
    },
    gstImgUrl: {
        type: String,
        trim: true
    },
    carAllowedIn: [{
        type: String,
        enum: ['Market', 'Bidding'],
        default: 'Market'
    }],
    termAccepted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true,
    },
    verifcationStatus: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    city: {
        type: String,
        trim: true
    }
});

const dealerModel = model("dealer", dealerSchema);
module.exports = dealerModel;
