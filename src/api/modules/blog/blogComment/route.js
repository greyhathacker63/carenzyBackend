const { Router } = require("express");
const controller = require("./controller");
const { blogCommentValidation } = require("../../../middlewares/validation/blogComment");

const router = Router({ mergeParams: true });

router.get("/list", controller.blogCommentList);
router.post("/save", blogCommentValidation, controller.blogCommentSave);
router.post("/delete", controller.blogCommentDelete);
router.get("/details/:_id", controller.blogCommentDetails);


module.exports = router;
