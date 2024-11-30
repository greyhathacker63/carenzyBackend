const { Router } = require("express");
const controller = require("./controller");

const router = Router({ mergeParams: true });

router.get("/list", controller.categoryList);


module.exports = router;