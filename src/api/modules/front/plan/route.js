const { Router } = require("express");
const controller = require("./controller");
const { validateToken } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", controller.planList)



module.exports = router