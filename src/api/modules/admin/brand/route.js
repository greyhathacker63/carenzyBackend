const { Router } = require("express");
const controller = require("./controller");
const { brandValidation } = require("../../../middlewares/validation/brand");
const { validateToken, checkRight, checkRightSave, checkRightDelete } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-sub-admin'), controller.brandList);
router.post("/save", validateToken, /*brandValidation,*/ checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.brandSave);
router.post("/delete", validateToken, checkRightDelete('delete-sub-admin'), controller.brandDelete);

module.exports = router;