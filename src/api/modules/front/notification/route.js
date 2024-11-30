const { Router } = require("express");
const controller = require("./controller");

const router = Router({ mergeParams: true });

router.get("/list", controller.list);
router.post("/clear/:type", controller.clearNotification);

module.exports = router;