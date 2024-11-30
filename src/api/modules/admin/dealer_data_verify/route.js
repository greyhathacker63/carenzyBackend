const { Router } = require("express");
const controller = require("./controller");
const { dealerDataVerify } = require("../../../middlewares/validation/dealer");
const { validateToken, checkRight, checkRightSave } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('verify-list'), controller.list);
router.get("/get-status", validateToken, checkRight('verify-list'), controller.checkVerified);
router.post("/save", validateToken, checkRightSave('verify-save', 'verify-edit'), dealerDataVerify, controller.save);
router.get("/details/:_id", validateToken, controller.details);


module.exports = router;