const { Router } = require("express");
const controller = require("./controller");
// const { plnValidation } = require("../../../middlewares/validation/plan")
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { authorValidation } = require("../../../middlewares/validation/author");

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('super-admin-access-list'), controller.authorList);
router.post("/save", validateToken, authorValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.authorSave);
router.post("/delete", validateToken, checkRightDelete('super-admin-access-delete'), controller.authorDelete);
router.get("/details/:_id", validateToken, checkRightDetail('super-admin-access-list'), controller.authorDetails);


module.exports = router;