const { Router } = require("express");
const controller = require("./controller");
const validation = require("../../../middlewares/validation/dealer");

const router = Router({ mergeParams: true });

router.get("/list", controller.list);
router.get("/list/v2", controller.list2);
router.post("/add", validation.saveFollower, controller.save);
router.post("/unfollow", controller.remove);
router.get('/count', controller.count);


module.exports = router;