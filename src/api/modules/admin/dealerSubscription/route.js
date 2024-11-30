const { Router } = require("express");
const controller = require("./controller");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-sub-admin'), controller.dealerSubscriptionList);
router.post("/save", validateToken, checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.dealerSubscriptionSave);
router.post("/delete", validateToken, checkRightDelete('delete-sub-admin'), controller.dealerSubscriptionDelete);
router.get("/details/:_id", validateToken, checkRightDetail('detail-sub-admin'), controller.dealerSubscriptionDetails);


module.exports = router;