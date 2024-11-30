const { Router } = require("express");
const controller = require("./controller");
const { rtoChargeValidation, checkFuleTypeAndRT } = require("../../../middlewares/validation/rtoCharge");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", validateToken, checkRight('list-master'), controller.rtoChargeList);
router.post("/save", rtoChargeValidation,checkFuleTypeAndRT, validateToken, checkRightSave('add-master', 'edit-master'), controller.rtoChargeSave);
router.post("/delete", validateToken, checkRightDelete('delete-master'), controller.rtoChargeDelete);


module.exports = router;