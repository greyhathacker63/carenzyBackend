const { Router } = require('express');
const controller = require('./controller');
const validation = require('../../../middlewares/validation/file');
const { formValidation } = require('../../../middlewares/others');
const multerUpload = require('../../../../utilities/multer')();
const { uploadFileBase64 } = require('../../../../utilities/Helper');
const { uploadToS3Bucket, deleteFromS3Bucket, uploadToS3BucketMultiple } = require('../../../middlewares/uploadToAWS');
// const { validateModule } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.post('/save', multerUpload?.single('file'), uploadToS3Bucket, controller.save);
router.post('/save-base64', validation.fileBase64, formValidation, uploadFileBase64, controller.save);
router.post('/remove', deleteFromS3Bucket, controller.remove);
router.post('/save-multiple', multerUpload?.array('files'), uploadToS3BucketMultiple, controller.saveMultiple);

module.exports = router;

