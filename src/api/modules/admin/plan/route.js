const { Router } = require("express");
const controller = require("./controller");
const { plnValidation } = require("../../../middlewares/validation/plan")
const { validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", checkRight('super-admin-access-list'), controller.subscriptionList);
router.post("/save", plnValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.subscriptionSave);
router.post("/delete", checkRightDelete('super-admin-access-delete'), controller.subscriptionDelete);
router.get("/details/:_id", checkRightDetail('super-admin-access-list'), controller.subscriptionDetails);


module.exports = router;