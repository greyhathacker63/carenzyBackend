const { Router } = require("express");
const controller = require("./controller");
const { getDetailValidation, bodyValidation } = require("../../../middlewares/validation/variantSpecFeat");
const { checkRight, checkRightSave, checkRightDelete } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", checkRight('list-master'), controller.list);
router.get("/details", getDetailValidation, checkRight('list-master'), controller.details);
router.post("/save", /*bodyValidation,*/ checkRightSave('add-master', 'edit-master'), controller.save);
router.post("/delete", checkRightDelete('delete-master'), controller.delete);


module.exports = router;