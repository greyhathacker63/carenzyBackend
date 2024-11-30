const { Router } = require("express");
const controller = require("./controller");
const { modelVariantValidation } = require("../../../middlewares/validation/modelVariant");
const { checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", checkRight('list-sub-admin'), controller.variantList);
router.post("/save", /*modelVariantValidation,*/ checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.variantSave);
router.post("/delete", checkRightDelete('delete-sub-admin'), controller.variantDelete);
router.get("/details/:_id", checkRightDetail('detail-sub-admin'), controller.variantDetails);

module.exports = router;