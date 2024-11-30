const { Router } = require("express");
const controller = require("./controller");
const { checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { subscriptionValidation, setLastDateForTheSubscription } = require("../../../middlewares/validation/subscription");

const router = Router({ mergeParams: true });

router.get("/list", checkRight('super-admin-access-list'), controller.subscriptionList);
router.post("/save", checkRightSave('super-admin-access-add', 'super-admin-access-edit'), subscriptionValidation, setLastDateForTheSubscription, controller.subscriptionSave);
router.post("/delete", checkRightDelete('super-admin-access-delete'), controller.subscriptionDelete);
router.get("/details/:_id", checkRightDetail('super-admin-access-list'), controller.subscriptionDetails);

router.get("/get-last-date/:dealerId", controller.getDealerLastSubscriptionDate);


module.exports = router;