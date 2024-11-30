const FormData = require('form-data');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const config = require('../../config');
const fileModel = require('../../models/file');

const s3 = new S3Client({
    credentials: {
        accessKeyId: config.awss3.accessKey,
        secretAccessKey: config.awss3.secretKey
    },
    region: config.awss3.region
});

async function uploadToAWS(req, res, next) {
    try {
        const file = fs.readFileSync(path.join(config.TempFileDir, req.file.filename));
        const form = new FormData();
        form.append('file', file, req.file.filename);
        const data = await axios.post(config.uploadServerIp + '/upload', form);
        req.file.url = data?.data?.url;
        fs.unlinkSync(path.join(config.TempFileDir, req.file.filename));
    } catch (err) {
    } finally {
        next();
    }
}

async function deleteFromAWS(req, res, next) {
    try {
        const name = req.body.url.split('/').pop();
        await axios.post(config.uploadServerIp + '/remove', { fileName: name });
    } catch (err) {
    } finally {
        next();
    }
}

async function uploadToS3Bucket(req, res, next) {
    try {
        const file = fs.readFileSync(path.join(config.TempFileDir, req.file.filename));
        const params = {
            Bucket: config.awss3.bucketName,
            Key: config.awss3.uploadDirName ? config.awss3.uploadDirName + "/" + req.file.filename : req.file.filename,
            Body: file,
            ContentType: req.file.mimetype
        };
        const upload = new Upload({ client: s3, params });
        const uploadedData = await upload.done();
        fs.unlinkSync(path.join(config.TempFileDir, req.file.filename));
        req.file.url = uploadedData?.Location;
    } catch (err) {
    } finally {
        next();
    }
}

async function uploadToS3BucketMultiple(req, res, next) {
    try {
        for (let i = 0; i < req.files.length; i++) {
            const { filename, mimetype } = req.files[i];
            const file = fs.readFileSync(path.join(config.TempFileDir, filename));
            const params = {
                Bucket: config.awss3.bucketName,
                Key: config.awss3.uploadDirName ? config.awss3.uploadDirName + "/" + filename : filename,
                Body: file,
                ContentType: mimetype
            };
            const upload = new Upload({ client: s3, params });
            const uploadedData = await upload.done();
            fs.unlinkSync(path.join(config.TempFileDir, filename));
            req.files[i].url = uploadedData?.Location;
        }
    } catch (err) {
    } finally {
        next();
    }
}

async function deleteFromS3Bucket(req, res, next) {
    try {
        const data = req.body.url.split("/");
        const name = data[data.length - 2] + '/' + data[data.length - 1]
        await s3.send(new DeleteObjectCommand({
            Bucket: config.awss3.bucketName,
            Key: name
        }));
    } catch (err) {
    } finally {
        next();
    }
}

module.exports = { uploadToAWS, deleteFromAWS, uploadToS3Bucket, uploadToS3BucketMultiple, deleteFromS3Bucket };