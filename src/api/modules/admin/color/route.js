const { Router } = require("express");
const controller = require("./controller");
const { colorValidation } = require("../../../middlewares/validation/color");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-sub-admin'), controller.colorList);
router.post("/save", /*colorValidation,*/ validateToken, checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.colorSave);
router.post("/delete", validateToken, checkRightDelete('delete-sub-admin'), controller.colorDelete);
router.get("/details/:_id", validateToken, checkRightDetail('detail-sub-admin'), controller.colorDetails);


module.exports = router;