const { Router } = require("express");
const controller = require("./controller");
const { fuleTypeValidation } = require("../../../middlewares/validation/fuleType");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-sub-admin'), controller.fuleTypeList);
router.post("/save",/* fuleTypeValidation,*/ validateToken, checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.fuleTypeSave);
router.post("/delete", validateToken, checkRightDelete('delete-sub-admin'), controller.fuleTypeDelete);


module.exports = router;