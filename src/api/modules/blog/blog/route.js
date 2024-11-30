const { Router } = require("express");
const controller = require("./controller");
const { blogCommentValidation } = require("../../../middlewares/validation/blogComment");

const router = Router({ mergeParams: true });

// Blog Routes
router.get("/list", controller.blogList);
router.get("/details/:slug", controller.blogDetails);

// Blog Comment Routes
router.get("/blog-comment/list", controller.blogCommentList);
router.post("/blog-comment/save", blogCommentValidation, controller.blogCommentSave);
router.post("/blog-comment/delete", controller.blogCommentDelete);
router.get("/blog-comment/details/:_id", controller.blogCommentDetails);

module.exports = router;