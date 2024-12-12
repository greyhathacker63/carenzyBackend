const { Router } = require("express");
const controller = require("./controller");
const router = Router({ mergeParams: true });

router.get('/list', controller.list);
router.get('/list/v2', controller.lists);


module.exports = router;