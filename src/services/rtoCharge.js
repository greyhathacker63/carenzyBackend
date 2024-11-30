const { Types } = require("mongoose");
const RTOchargeModel = require("../models/rtoCharge");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper");

class RTOchargeServices {

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                brandId: query.brandId ? Types.ObjectId(query.brandId) : '',
                rtoId: query.rtoId ? Array.isArray(query.rtoId) ? { $in: query.rtoId.map(v => Types.ObjectId(v)) } : Types.ObjectId(query.rtoId) : '',
                status: query.forFront ? true : "",
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        stateId: 1,
                        rtoId: 1,
                        fuleTypeId: 1,
                        registrationType: 1,
                        minPrice: 1,
                        maxPrice: 1,
                        taxPercentage: 1,
                        status: 1,
                    }
                },
            ];

            response = await paginationAggregate(RTOchargeModel, $aggregate, $extra);
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
            const docData = _id ? await RTOchargeModel.findById(_id) : new RTOchargeModel();
            docData.stateId = data.stateId;
            docData.rtoId = data.rtoId;
            docData.fuleTypeId = data.fuleTypeId;
            docData.registrationType = data.registrationType;
            docData.minPrice = data.minPrice;
            docData.maxPrice = data.maxPrice;
            docData.taxPercentage = data.taxPercentage;
            docData.status = data.status ?? docData.status;

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
                await RTOchargeModel.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await RTOchargeModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }
            response.status = true;
            response.id = ids

            return response;
        } catch (error) {
            throw error;
        }

    }
}

module.exports = RTOchargeServices;