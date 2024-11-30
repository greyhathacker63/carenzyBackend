const { Router } = require("express");
const controller = require("./controller");
const { blogValidation } = require("../../../middlewares/validation/blog");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('super-admin-access-list'), controller.blogList);
router.post("/save", validateToken, blogValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.blogSave);
router.post("/delete", validateToken, checkRightDelete('super-admin-access-delete'), controller.blogDelete);
router.get("/details/:_id", validateToken, checkRightDetail('super-admin-access-list'), controller.blogDetails);


module.exports = router;