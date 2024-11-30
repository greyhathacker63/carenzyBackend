const brandModelService = require('../../../../services/brandModel');
const variantSpecFeatureService = require('../../../../services/variantSpecFeature');
const fuleTypeService = require('../../../../services/fuleType');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');


class controller {
    static async details(req, res) {
        try {
            const response = {
                data: [],
                message: Message.noContent.message,
                code: Message.noContent.code,
                extra: {}
            };
            const srvResVariantSpecFeature = await variantSpecFeatureService.listFront({ ...req.query, isAll: 1 });

            if (srvResVariantSpecFeature?.data?.length) {
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
                    delete variant.subMasterDetails;
                });
                response.data = variants?.[0];
                // response.data = srvResVariantSpecFeature;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
                response.extra = srvResVariantSpecFeature.extra;
            }

            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async list(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await brandModelService.listCarAdmin({ ...req.query, dealerId: req?.__cuser?._id });
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

    static async listYearVariants(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await brandModelService.listYearVariants({ ...req.query, modelId: req.params.modelId });
            if (srvRes.data) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }

}

module.exports = controller;