const { Router } = require("express");
const controller = require("./controller");
const { bodyTypeValidation } = require("../../../middlewares/validation/bodyType");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-sub-admin'), controller.bodyTypeList);
router.post("/save", /*bodyTypeValidation,*/ validateToken, checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.bodyTypeSave);
router.post("/delete", validateToken, checkRightDelete('delete-sub-admin'), controller.bodyTypeDelete);


module.exports = router;