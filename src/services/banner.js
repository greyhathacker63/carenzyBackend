const { Types } = require("mongoose");
const banner = require("../models/banner");
const { paginationAggregate } = require('../utilities/pagination');
const { clearSearch } = require("../utilities/Helper")

class bannerServices {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await banner.findOne({
                _id,
            })
            response.status = true;
            return response;
        } catch (error) {
            throw error
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                position: query.position ? query.position : '',
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { index: 1 } },
                {
                    $project: {
                        position: 1,
                        url: 1,
                        status: 1,
                        redirectUrl: 1,
                        index: 1,
                        visibleTo: 1,
                        is_app: 1
                    }
                },
            ];
            response = await paginationAggregate(banner, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async listFront(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };

        try {
            const search = {
                _id: query._id ? Array.isArray(query._id) ? { $in: query._id?.map(v => Types.ObjectId(v)) } : Types.ObjectId(query._id) : '',
                position: query.position ? query.position : '',
                visibleTo: query.visibleTo ? { $in: query.visibleTo } : '',
                is_app :query.is_app === 'true',
                status: true,
                isDeleted: false
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { index: 1 } },
                {
                    $project: {
                        url: 1,
                        visibleTo: 1,
                        position: 1,
                        is_app:1,
                        redirectUrl: 1
                    }
                },
            ];
            response = await paginationAggregate(banner, $aggregate, $extra);
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
            const docData = _id ? await banner.findById(_id) : new banner();
            docData.position = data.position;
            docData.url = data.url;
            docData.redirectUrl = data.redirectUrl;
            docData.index = data.index;
            docData.visibleTo = data.visibleTo;
            docData.status = data.status;
            docData.is_app = data.is_app;

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
                await banner.updateMany({ $or: [{ _id: { $in: ids } }] }, { isDeleted: true })

            }
            else if (typeof ids === "string") {
                await banner.updateOne({ _id: Types.ObjectId(ids) }, { isDeleted: true });
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

module.exports = bannerServices;