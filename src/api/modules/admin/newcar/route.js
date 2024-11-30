const { Router } = require("express");
const controller = require("./controller");
const router = Router({ mergeParams: true });

router.get('/list', controller.list);
router.get('/details', controller.details);
router.get('/year-variants/:modelId', controller.listYearVariants);


module.exports = router;