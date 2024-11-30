const { Router } = require("express");
const controller = require("./controller");
const router = Router({ mergeParams: true });

router.get('/list', controller.list);
router.get('/model/list', controller.listModel);
router.get('/model/variant/list', controller.listModelVariant);

module.exports = router;