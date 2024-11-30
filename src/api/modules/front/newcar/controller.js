const brandModelService = require('../../../../services/brandModel');
const bookmarkService = require('../../../../services/brandModelBookmark');
const likeService = require('../../../../services/brandModelLike');
const variantSpecFeatureService = require('../../../../services/variantSpecFeature');
const fuleTypeService = require('../../../../services/fuleType');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');


class controller {
    static async details(req, res) {
        try {
            const response = {
                data: {
                    overview: {},
                    specFeatureOverview: {},
                    variants: [],
                    vaiantFueltypes: [],
                },
                message: Message.noContent.message,
                code: Message.noContent.code, extra: {}
            };
            const srvResBrandModel = await brandModelService.listCar({ _id: req.params._id, dealerId: req?.__cuser?._id });
            const srvResVariantSpecFeature = await variantSpecFeatureService.listFront({ modelId: req.params._id, isAll: 1 });
            const srvResFuelTypeData = srvResBrandModel.data?.[0]?.fuelTypeIds ? (await fuleTypeService.listFront({ _id: srvResBrandModel.data[0].fuelTypeIds, isAll: 1 }))?.data || [] : [];

            if (srvResBrandModel.data?.length && srvResVariantSpecFeature?.data?.length) {
                response.data.overview = JSON.parse(JSON.stringify(srvResBrandModel.data)).map(({ fuelTypeIds, ...others }) => others)?.[0];

                const variants = JSON.parse(JSON.stringify((srvResVariantSpecFeature.data).filter(v => v.specFeature.length).map(({ subMasterDataDetails, masterDetails, ...others }) => others)));
                variants.map(variant => {
                    variant.specFeature = variant.specFeature?.map(master => {
                        return {
                            name: master.name,
                            subMaster: master.subMaster?.map(subMaster => {
                                return {
                                    name: subMaster.name,
                                    subMasterData: subMaster.subMasterData?.map(subMasterData => subMasterData.title)
                                }
                            })
                        }
                    });
                });
                variants.map(variant => {
                    /**
                     * Removed comparision data
                     */
                    // variant.comparisonData = variant.subMasterDetails.map(subMaster => {
                    //     return {
                    //         _id: subMaster._id,
                    //         name: subMaster.name,
                    //         subMasterData: subMaster.subMasterData?.map(subMasterData => subMasterData.title)
                    //     }
                    // });
                    delete variant.subMasterDetails;
                });
                response.data.variants = variants;
                response.data.specFeatureOverview = variants;
                response.data.vaiantFueltypes = srvResFuelTypeData.map(v => ({ ...v, variantCount: variants.filter(vv => vv.fuelTypeId == v?._id)?.length}));
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await brandModelService.listCar({ ...req.query, dealerId: req?.__cuser?._id });
            if (srvRes.data.length) {
                response.data = srvRes.data.map(({ milage, enginePower, fuelTypeIds, bhp, ...others }) => others);
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async listBookmarks(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const bookmarkRes = await bookmarkService.listBookmarks({ dealerId: req?.__cuser?._id, isAll: 1 });
            const bookmarkList = await brandModelService.listCar({ dealerId: req?.__cuser?._id, _id: bookmarkRes.data.map(v => v.brandModelId) });
            if (bookmarkList.data.length) {
                response.data = bookmarkList.data.map(({ milage, enginePower, fuelTypeIds, bhp, ...others }) => others);
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = bookmarkList.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async updateDealerBookmark(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await bookmarkService.updateDealerBookmark({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = req.body.type === "add" ? "Added to bookmark list" : "Removed from bookmark list";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async updateDealerBookmarkMultiple(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await bookmarkService.updateDealerBookmarkMultiple([...req.body?.map(v => ({ ...v, dealerId: req.__cuser._id }))]);
            if (srvRes.status) {
                response.message = "Bookmark list updated";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async updateDealerLikes(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await likeService.updateDealerLikes({ ...req.body, dealerId: req.__cuser._id });
            if (srvRes.status) {
                response.message = req.body.type === "add" ? "You liked this car" : "Removed from your likes";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async updateDealerLikesMultiple(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await likeService.updateDealerLikesMultiple([...req.body?.map(v => ({ ...v, dealerId: req.__cuser._id }))]);
            if (srvRes.status) {
                response.message = "Likes list updated";
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
}

module.exports = controller;