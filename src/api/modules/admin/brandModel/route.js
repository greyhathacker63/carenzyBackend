const { Router } = require("express");
const controller = require("./controller");
const { brandModelValidation } = require("../../../middlewares/validation/brandModel");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", checkRight('list-sub-admin'), controller.modelList);
router.post("/save", /* brandModelValidation,  */checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.modelSave);
router.post("/delete", checkRightDelete('delete-sub-admin'), controller.modelDelete);
router.get("/details/:_id", checkRightDetail('detail-sub-admin'), controller.modelDetails);


module.exports = router;