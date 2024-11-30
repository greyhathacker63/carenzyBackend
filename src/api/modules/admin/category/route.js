const { Router } = require("express");
const controller = require("./controller");
// const { plnValidation } = require("../../../middlewares/validation/plan")
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { categoryValidation } = require("../../../middlewares/validation/category");

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('super-admin-access-list'), controller.categoryList);
router.post("/save", validateToken, categoryValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.categorySave);
router.post("/delete", validateToken, checkRightDelete('super-admin-access-delete'), controller.categoryDelete);
router.get("/details/:_id", validateToken, checkRightDetail('super-admin-access-list'), controller.categoryDetails);


module.exports = router;