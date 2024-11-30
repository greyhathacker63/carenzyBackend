const { Types } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Logger = require('../utilities/Logger');
const Response = require('../utilities/Response');
const Message = require('../utilities/Message');
const adminModel = require('../models/admin');
const config = require('../config');
const { clearSearch } = require('../utilities/Helper');
const { paginationAggregate } = require('../utilities/pagination');

class MasterService {
    static async login({ email, password }) {
        // const
        try {
            const response = { data: {}, status: false };

            const user = await adminModel.findOne({ email });

            if (!user) {
                throw new Error('Account does not exist');
            }

            let isPasswordMatched = await bcrypt.compare(password, user.password);
            if (!isPasswordMatched) {
                throw new Error("Invalid Credentials");
            } else if (!user.status) {
                throw new Error('Account is blocked. Contact super admin!!');
            } else {
                const JWT_EXP_DUR = config.jwt.expDuration;
                const accessToken = jwt.sign({ sub: user._id.toString(), exp: Math.floor(Date.now() / 1000) + ((JWT_EXP_DUR) * 60), }, config.jwt.secretKey);
                const type = user.type;
                response.data.accessToken = accessToken;
                response.data.type = type;
                response.data.adminRights = user?.adminRights;

                response.status = true;
            }


            return response;

        } catch (e) {
            throw e;
        }
    }

    static async updatePassword(data) {
        const response = { resCode: Message.internalServerError.code, message: Message.internalServerError.message };

        try {
            const docData = await adminModel.findById(data._id);

            docData.password = data.newPassword;
            docData.status = data.status;

            await docData.save();

            response.message = "Password updated";
            response.resCode = Message.dataSaved.code;

            return response;

        } catch (e) {
            throw Response.createError(Message.dataSavingError, e);
        }
    }

    static async profile(cuser) {
        const response = {
            resCode: Message.noContent.code,
            message: Message.noContent.message,
            data: {
                result: {}
            },
        };

        try {
            const result = await adminModel.findById(cuser._id).select('-password -type -_id -createdAt -updatedAt -__v').lean();

            response.data.result = result;
            if (response.data.result) {
                response.message = Message.dataFound.message;
                response.resCode = Message.dataFound.code;
            }
            return response;
        } catch (e) {
            throw Response.createError(Message.dataFetchingError, e);
        }
    }

    static async saveProfile(data, cuser) {
        const response = { resCode: Message.profileUpdateError.code, message: Message.profileUpdateError.message };

        try {
            const docData = await adminModel.findById(cuser._id);
            if (!docData) {
                throw new Error('');
            }

            docData.cityId = data.cityId;
            docData.stateId = data.stateId;
            docData.country = data.country;
            // docData.avatar = data.avatar;
            docData.firstName = data.firstName;
            docData.lastName = data.lastName;
            docData.pinCode = data.pinCode;
            docData.phone = data.phone;
            // docData.email = data.email;

            await docData.save();

            response.message = Message.profileUpdate.message;
            response.resCode = Message.profileUpdate.code;

            return response;

        } catch (e) {
            throw Response.createError(Message.dataSavingError, e);
        }
    }

    static async changeAvatar(data) {
        const response = { resCode: Message.profileUpdateError.code, message: Message.profileUpdateError.message };

        try {
            const docData = await adminModel.findById(data.adminId);
            docData.avatar = data.avatar;

            await docData.save();

            response.message = Message.profileUpdate.message;
            response.resCode = Message.profileUpdate.code;

            return response;

        } catch (e) {
            throw Response.createError(Message.dataSavingError, e);
        }
    }



    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? query._id?.map(v => Types.ObjectId(v)) : Types.ObjectId(query._id) : '',
                roleId: query.roleId ? Types.ObjectId(query.roleId) : undefined,
                stateId: query.stateId ? Types.ObjectId(query.stateId) : undefined,
                cityId: query.cityId ? Types.ObjectId(query.cityId) : undefined,
                $or: query.key ? [
                    {
                        firstName: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        lastName: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        email: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        phone: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                ] : '',
                type: 'subAdmin',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        cityId: 1,
                        stateId: 1,
                        roleId: 1,
                        firstName: 1,
                        lastName: 1,
                        phone: 1,
                        email: 1,
                        status: 1,
                        adminRights: 1
                    }
                },
            ];
            response = await paginationAggregate(adminModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };

        try {
            const docData = _id ? await adminModel.findById(_id) : new adminModel();
            docData.cityId = data.cityId;
            docData.stateId = data.stateId;
            docData.roleId = data.roleId;
            docData.firstName = data.firstName;
            docData.lastName = data.lastName;
            docData.adminRights = data.adminRights;
            !data.password || (docData.password = data.password);
            docData.phone = data.phone;
            docData.email = data.email;
            docData.status = data.status ?? docData.status;
            docData.type = 'subAdmin';
            await docData.save();

            response.data = docData;
            response.status = true;

            return response;

        } catch (err) {
            throw err;
        }
    }
    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {

            if (Array.isArray(ids)) {
                await adminModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === 'string') {
                await adminModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }

            response.status = true;
            response.ids = ids;

            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = MasterService;
