const { Types } = require('mongoose');
const jwt = require("jsonwebtoken");
const dealerModel = require("../models/dealer");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require('../utilities/pagination');
const config = require("../config");
const dealerSubscriptionService = require('./dealerSubscription');


class UserService {

    static async checkAccountStatus(data) {
        try {
            const response = { data: { user: {}, accountStatus: '' }, status: false };

            let docData = await dealerModel.findOne({ phones: data.phone, isDeleted: false });
            if (!docData) {
                response.data.accountStatus = 'not-exist';
            } else if (!docData.verifcationStatus) {
                response.data.accountStatus = 'not-verified';
            } else if (!docData.status) {
                response.data.accountStatus = 'not-active';
            } else if (docData.status) {
                response.data.accountStatus = 'active';
                response.data.subscriptionDetails = (await dealerSubscriptionService.getSubscriptionLastDate({ dealerId: docData._id }))?.data;
            }

            response.data.user = docData;
            response.status = true;

            return response;
        } catch (e) {
            throw e;
        }
    }

    static async sendOtp(data) {
        try {
            const response = { data: {}, status: false };

            let docData = await dealerModel.findOne({ phones: data.phone, isDeleted: false });
            if (!docData) {
                docData = new dealerModel();
                docData.phones = [data.phone];
                docData.verifcationStatus = false;
                await docData.save();
            }

            response.data = docData;
            response.status = true;

            return response;
        } catch (e) {
            throw e;
        }
    }

    static async generateNextCRZNumber() {
        // Fetch the latest user document based on the crzNumber in descending order
        const latestUser = await dealerModel.findOne({}, {}, { sort: { crz: -1 } });

        let startingNumber = 10000;
        if (latestUser?._id || !latestUser?.crz) { //second conditon is when the user is very first
            // If there are documents in the collection, extract the numeric part of the crzNumber

            if (latestUser?.crz) {
                const latestCRZNumber = parseInt(latestUser.crz.replace(/\D/g, ''));
                startingNumber = latestCRZNumber + 1;
            }
        }

        // Format the new CRZ number as "crz-xxxxx" (where xxxxx is the incremented number)
        const crzNumber = `CRZ${startingNumber}`;

        // Return the CRZ number
        return crzNumber;
    }

    static genJwtToken(data) {
        try {
            const response = { data: "", status: false };

            response.data = jwt.sign(
                {
                    sub: data._id.toString(),
                    exp: Math.floor(Date.now() / 1000) + ((config.jwt.expDuration) * 60)
                },
                config.jwt.secretKey);

            response.status = true;

            return response;
        } catch (e) {
            throw new Error("Error while generating token" + e.message);
        }
    }

    static async dealerData(_id) {
        try {
            const response = { data: {}, status: false };

            response.data = (await dealerModel.aggregate(
                [
                    { $match: { _id: _id ? Types.ObjectId(_id) : '', } },
                    {
                        $lookup: {
                            from: "rtos",
                            localField: "rtoId",
                            foreignField: "_id",
                            as: "rtoDetails",
                            pipeline: [
                                {
                                    $project: {
                                        name: '$name',
                                        code: '$code'
                                    }
                                }
                            ]
                        }
                    },
                    { $unwind: { path: '$rtoDetails', preserveNullAndEmptyArrays: true } },
                    {
                        $lookup: {
                            from: "metadatas",
                            localField: "registrationCertificateId",
                            foreignField: "_id",
                            as: "registrationCertificateDetails",
                            pipeline: [
                                {
                                    $project: {
                                        name: '$name',
                                    }
                                }
                            ]
                        }
                    },
                    { $unwind: { path: '$registrationCertificateDetails', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            rtoId: { $cond: ["$rtoId", "$rtoId", null] },
                            phones: { $cond: ["$phones", "$phones", null] },
                            crz: { $cond: ["$crz", "$crz", null] },
                            name: { $cond: ["$name", "$name", null] },
                            bio: { $cond: ["$bio", "$bio", null] },
                            location: { $cond: ["$location", "$location", null] },
                            dealershipName: { $cond: ["$dealershipName", "$dealershipName", null] },
                            rtoName: { $cond: ["$rtoDetails.name", "$rtoDetails.name", null] },
                            rtoCode: { $cond: ["$rtoDetails.code", "$rtoDetails.code", null] },
                            email: { $cond: ["$email", "$email", null] },
                            aadhaarNo: { $cond: ["$aadhaarNo", "$aadhaarNo", null] },
                            pan: { $cond: ["$pan", "$pan", null] },
                            avatar: { $cond: ["$avatar", "$avatar", null] },
                            adharFrontImgUrl: { $cond: ["$adharFrontImgUrl", "$adharFrontImgUrl", null] },
                            adharBackImgUrl: { $cond: ["$adharBackImgUrl", "$adharBackImgUrl", null] },
                            panNo: { $cond: ["$panNo", "$panNo", null] },
                            panCardimgUrl: { $cond: ["$panCardimgUrl", "$panCardimgUrl", null] },
                            signupThrough: { $cond: ["$signupThrough", "$signupThrough", null] },
                            address: { $cond: ["$address", "$address", null] },
                            pinCode: { $cond: ["$pinCode", "$pinCode", ""] },
                            shopPhotoUrl: { $cond: ["$shopPhotoUrl", "$shopPhotoUrl", null] },
                            registrationCertImgUrl: { $cond: ["$registrationCertImgUrl", "$registrationCertImgUrl", null] },
                            gstNo: { $cond: ["$gstNo", "$gstNo", null] },
                            gstImgUrl: { $cond: ["$gstImgUrl", "$gstImgUrl", null] },
                            dateOfBirth: { $cond: ["$dateOfBirth", "$dateOfBirth", null] },
                            verifcationStatus: { $cond: ["$verifcationStatus", "$verifcationStatus", null] },
                            incompleteAccount: { $cond: ["$dealershipName", false, true] },
                            registrationCertificateId: { $cond: ["$registrationCertificateId", "$registrationCertificateId", null] },
                            registrationCertificateName: { $cond: ["$registrationCertificateDetails.name", "$registrationCertificateDetails.name", null] },
                        }
                    },
                ]
            ))?.[0];

            response.status = true;

            return response;
        } catch (e) {
            throw e;
        }
    }

    static async dealerUpdate(data) {
        try {
            const response = { data: {}, status: false };

            const docData = await dealerModel.findById(data._id);


            docData.name = data.name;
            docData.bio = data.bio;
            // docData.rtoId = data.rtoId;
            docData.stateId = data.stateId;
            docData.dealershipName = data.dealershipName;
            docData.email = data.email;
            // docData.location = data.location ?? docData.location;
            docData.address = data.address;
            docData.pinCode = data.pinCode;
            docData.aadhaarNo = data.aadhaarNo;
            docData.adharFrontImgUrl = data.adharFrontImgUrl;
            docData.adharBackImgUrl = data.adharBackImgUrl;
            docData.panNo = data.panNo;
            docData.panCardimgUrl = data.panCardimgUrl;
            // docData.gstNo = data.gstNo;
            // docData.registrationCertificateId = data.registrationCertificateId;

            // // docData.avatar = data.avatar;
            docData.shopPhotoUrl = data.shopPhotoUrl;
            // docData.registrationCertImgUrl = data.registrationCertImgUrl;
            // docData.gstImgUrl = data.gstImgUrl;
            docData.crz = data.crz;
            docData.city = data.city;
            // docData.phones = data.phones;
            await docData.save();

            response.data = docData;
            response.status = true;

            return response;
        } catch (error) {
            throw error;
        }
    }

    static async dealerUpdateKeyWise(data) {
        try {
            const response = { data: {}, status: false };

            const docData = await dealerModel.findById(data._id);

            for (const [key, value] of Object.entries(data)) {
                docData[key] = value;
            }
            await docData.save();

            response.data = docData;
            response.status = true;

            return response;
        } catch (error) {
            throw error;
        }
    }

    static async detailsDealer({ _id, crz, email, aadhaarNo, panNo, gstNo }) {
        let response = { data: [], status: false };
        try {
            const search = {
                _id: _id ? Types.ObjectId(_id) : '',
                crz: crz ? crz : '',
                email: email ? email : '',
                aadhaarNo: aadhaarNo ? aadhaarNo : '',
                panNo: panNo ? panNo : '',
                gstNo: gstNo ? gstNo : '',
                isDeleted: false
            }
            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'dealer_data_verifications',
                        localField: "_id",
                        foreignField: "dealerId",
                        as: 'verificationDetails',
                    },
                },
            ];
            response.data = (await dealerModel.aggregate([...$aggregate]))?.[0] || {};
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async listDealer(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? query._id?.map(v => Types.ObjectId(v)) : Types.ObjectId(query._id) : '',
                $or: query.key ? [
                    { crz: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                    { name: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                    { email: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                    { phones: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                    { dealershipName: { '$regex': new RegExp(query.key || ''), $options: 'i' } },
                ] : '',
                phones: query.phones ? Array.isArray(query.phones) ? { $in: query.phones } : query.phones : '',
                crz: query.crz ? { '$regex': new RegExp(query.crz || ''), $options: 'i' } : '',
                aadhaarNo: query.aadhaarNo ? query.aadhaarNo : '',
                status: query.status == '0' || query.status == '1' ? Boolean(parseInt(query.status)) : '',
                verifcationStatus: query.verifcationStatus == '0' || query.verifcationStatus == '1' ? Boolean(parseInt(query.verifcationStatus)) : '',
                isDeleted: false
            };

            clearSearch(search);

            if (query.crz === 'Not Registered' || query.crz === 'Registered') {
                if (query.crz === 'Not Registered') {
                    search.crz = null;
                } else if (query.crz === 'Registered') {
                    search.crz = { $ne: null };
                }
            }

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'dealer_data_verifications',
                        localField: "_id",
                        foreignField: "dealerId",
                        as: 'verificationDetails',
                    },
                },
                {
                    $project: {
                        stateId: 1,
                        phones: 1,
                        location: 1,
                        crz: 1,
                        name: 1,
                        dealershipName: 1,
                        rtoId: 1,
                        email: 1,
                        pinCode: 1,
                        aadhaarNo: 1,
                        pan: 1,
                        avatar: 1,
                        adharFrontImgUrl: 1,
                        adharBackImgUrl: 1,
                        panNo: 1,
                        panCardimgUrl: 1,
                        signupThrough: 1,
                        address: 1,
                        shopPhotoUrl: 1,
                        registrationCertImgUrl: 1,
                        gstNo: 1,
                        gstImgUrl: 1,
                        dateOfBirth: 1,
                        status: 1,
                        verifcationStatus: 1,
                        verificationDetails: 1,
                        carAllowedIn: 1,
                        currentPlan: { amount: "2000", period: "60 days" }
                    }
                },
            ];
            response = await paginationAggregate(dealerModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    static async saveDealer(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await dealerModel.findById(_id) : new dealerModel();
            docData.phones = data.phones;
            docData.crz = data.crz;
            docData.name = data.name;
            docData.location = data.location ?? docData.location;
            docData.otp = data.otp;
            docData.stateId = data.stateId;
            docData.dealershipName = data.dealershipName;
            docData.rtoId = data.rtoId;
            docData.email = data.email;
            docData.pinCode = data.pinCode;
            docData.address = data.address;
            docData.aadhaarNo = data.aadhaarNo;
            docData.adharFrontImgUrl = data.adharFrontImgUrl;
            docData.adharBackImgUrl = data.adharBackImgUrl;
            docData.panNo = data.panNo;
            docData.panCardimgUrl = data.panCardimgUrl;
            docData.avatar = data.avatar;
            docData.shopPhotoUrl = data.shopPhotoUrl;
            docData.registrationCertImgUrl = data.registrationCertImgUrl;
            docData.gstNo = data.gstNo;
            docData.gstImgUrl = data.gstImgUrl;
            docData.carAllowedIn = data.carAllowedIn;
            docData.dateOfBirth = data.dateOfBirth;
            docData.status = data.status ?? docData.status
            docData.verifcationStatus = data.verifcationStatus ?? docData.verifcationStatus
            docData.signupThrough = 'admin';

            await docData.save();

            response.data = docData;
            response.status = true;

            return response;

        } catch (err) {
            throw err;
        }
    }
    static async saveDealerByKeys(data) {
        const response = { data: {}, status: false };

        try {
            const docData = data._id ? await dealerModel.findById(data._id) : new dealerModel();

            Object.keys(data).map(v => {
                docData[v] = data[v];
            })

            await docData.save();

            response.data = docData;
            response.status = true;

            return response;

        } catch (err) {
            throw err;
        }
    }
    static async deleteDealer(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await dealerModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === 'string') {
                await dealerModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }

            response.status = true;
            response.ids = ids;

            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listDistinctLocation(query = {}) {
		const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
		let response = { data: [], extra: { ...$extra }, status: false };

		try {
			const search = {
				location: { $ne: null },
				isDeleted: false
			};

			const $aggregate = [
				{ $match: search },
				{
					$project: {
						location: 1,
					}
				},
				{
					$group: {
						_id: "$location",
					}
				},
				{
					$project: {
						_id: 0,
						status: "$_id",
					}
				},
				{
					$sort: { status: 1 }
				},
			];
			response = await paginationAggregate(dealerModel, $aggregate, $extra);
			response.data = response.data.map(v => v.status);
			response.status = true;
			return response;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = UserService;