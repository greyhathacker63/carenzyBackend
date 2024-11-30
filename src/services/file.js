const Response = require('../utilities/Response');
const Message = require('../utilities/Message');
const fileModel = require('../models/file');
const { genFileUrl, removeFile } = require('../utilities/Helper');

module.exports = class file {

    static async save(file) {
        const response = { resCode: Message.internalServerError.code, message: Message.internalServerError.message };

        try {
            const url = file.url || genFileUrl(file.filename);
            const docData = new fileModel();

            docData.uid = file.filename.split('.')[0];
            docData.name = file.filename;
            docData.url = url;

            await docData.save();

            response.message = Message.fileUploaded.message;
            response.resCode = Message.fileUploaded.code;
            response.data = {
                uid: docData.uid,
                name: docData.name,
                url: url
            };

            return response;

        } catch (e) {
            throw Response.createError(Message.dataSavingError, e);
        }
    }
    static async remove(body) {
        const response = { resCode: Message.dataDeletionError.code, message: Message.dataDeletionError.message };

        try {
            const name = body.url.split('/').pop();
            await fileModel.updateOne({ uid: name.split('.')[0] }, { isDeleted: true });
            removeFile(name);
            response.message = Message.dataDeleted.message;
            response.resCode = Message.dataDeleted.code;
            return response;
        } catch (e) {
            throw Response.createError(Message.dataDeletionError, e);
        }
    }

}