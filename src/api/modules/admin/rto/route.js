const { Router } = require("express");
const controller = require("./controller");
const { rtoValidation } = require("../../../middlewares/validation/rto");
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", checkRight('list-master'), controller.rtoList);
router.post("/save", rtoValidation, checkRightSave('add-master', 'edit-master'), controller.rtoSave);
router.post("/delete", checkRightDelete('delete-master'), controller.rtoDelete);


module.exports = router;