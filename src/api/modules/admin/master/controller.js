const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const masterService = require('../../../../services/master');
const subMasterService = require('../../../../services/subMaster');
const subMasterDataService = require('../../../../services/subMasterData');

class masterController {

    /* ------------------ Master APIs ------------------ */
    static async masterList(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await masterService.list(req.query);
            if (srvRes.data.length) {
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
    static async masterSave(req, res, next) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await masterService.save({ ...req.body });
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async masterDelete(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await masterService.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }

    /* ------------------ Sub Master APIs ------------------ */
    static async subMasterList(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subMasterService.list(req.query);
            if (srvRes.data.length) {
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
    static async subMasterSave(req, res, next) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await subMasterService.save({ ...req.body });
            if (srvRes.status) {
                if (req.body.dataType === "boolean") {
                    /**
                     * Add true & false if sub master data type is "boolean"
                     */
                    const { data } = await subMasterDataService.list({ subMasterId: srvRes.data._id });
                    if (!data.length) {
                        await subMasterDataService.save({ subMasterId: srvRes.data._id, title: "TRUE" });
                        await subMasterDataService.save({ subMasterId: srvRes.data._id, title: "FALSE" });
                    } else if(data){
                        // if(data)
                    }
                }
                response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async subMasterDelete(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await subMasterService.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }

    /* ------------------ Sub Master APIs ------------------ */
    static async subMasterDataList(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await subMasterDataService.list(req.query);
            if (srvRes.data.length) {
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
    static async subMasterDataSave(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await subMasterDataService.save({ ...req.body });
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async subMasterDataDelete(req, res) {
        try {
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await subMasterDataService.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
}

module.exports = masterController;