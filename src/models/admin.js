const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;

const modelSchema = new Schema({
    cityId: {
        type: Types.ObjectId,
        ref: 'cities'
    },
    stateId: {
        type: Types.ObjectId,
        ref: "states"
    },
    country: {
        type: String
    },
    roleId: {
        type: Types.ObjectId,
        ref: "roles"
    },
    adminRights: [
        {
            type: String,
        }
    ],
    type: {
        type: String,
        enum: ['superAdmin', 'subAdmin'],
        default: 'subAdmin'
    },
    avatar: {
        type: String,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    pinCode: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

modelSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = model('admin', modelSchema);