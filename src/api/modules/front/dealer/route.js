const { Router } = require("express");
const controller = require("./controller");
const validation = require("../../../middlewares/validation/dealer");
const { validateToken, verificationCheck } = require("../../../middlewares/authFront");
// const multerUpload = require('../../../../utilities/multer')();
// const { uploadToS3Bucket } = require('../../../middlewares/uploadToAWS');

const router = Router({ mergeParams: true });

router.post("/send-otp", validation.frontDealerLogin, /* validation.checkDealerIsValid, */ controller.sendOtp);
router.post("/validate-otp", validation.frontValidateOtp, validation.userOtpSession, controller.validateOtp);
router.get('/location-list', controller.listDistinctLocation);

router.use(validateToken);
router.post("/accept-terms", controller.updateTermsAcceptance);
router.get("/accept-terms", controller.getTermsAcceptance);
router.get("/details", controller.dealerData);
router.post("/update-user", validation.updateDealerFront, controller.dealerUpdate);
router.post("/update-avatar", validation.updateDealerFrontProfileImg, /* multerUpload?.single('file'), uploadToS3Bucket, */ controller.dealerProfileAvatarChange);
router.post("/update-shopimg", validation.updateDealerFrontShopImg, /* multerUpload?.single('file'), uploadToS3Bucket, */ controller.dealerShopImgChange);

router.get("/details/:_id", verificationCheck, controller.otherDealerData);
router.post("/delete-account", controller.deleteDealer);

router.get('/validate-token', controller.validateToken);

module.exports = router;