const { Router } = require("express");
const controller = require("./controller");
const { engineTypeValidation } = require("../../../middlewares/validation/engineType");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-sub-admin'), controller.engineTypeList);
router.post("/save", /*engineTypeValidation,*/ validateToken, checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.engineTypeSave);
router.post("/delete", validateToken, checkRightDelete('delete-sub-admin'), controller.engineTypeDelete);
router.get("/details/:_id", validateToken, checkRightDetail('detail-sub-admin'), controller.engineTypeDetails);


module.exports = router;