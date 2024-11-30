const { Router } = require("express");
const controller = require("./controller");
const { blogCommentValidation } = require("../../../middlewares/validation/blogComment");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('super-admin-access-list'), controller.blogCommentList);
router.post("/save", validateToken, blogCommentValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.blogCommentSave);
router.post("/delete", validateToken, checkRightDelete('super-admin-access-delete'), controller.blogCommentDelete);
router.get("/details/:_id", validateToken, checkRightDetail('super-admin-access-list'), controller.blogCommentDetails);


module.exports = router;
