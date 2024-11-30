const { Router } = require("express");
const controller = require("./controller");
const { masterValidation, subMasterValidation, subMasterDataValidation } = require("../../../middlewares/validation/master");
const { checkRight, checkRightSave, checkRightDelete } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });

router.get("/list", checkRight('list-sub-admin'), controller.masterList);
router.post("/save", checkRightSave('add-sub-admin', 'edit-sub-admin'), masterValidation, controller.masterSave);
router.post("/delete", checkRightDelete('delete-sub-admin'), controller.masterDelete);

router.get("/sub-master/list", checkRight('list-sub-admin'), controller.subMasterList);
router.post("/sub-master/save",  checkRightSave('add-sub-admin', 'edit-sub-admin'), subMasterValidation, controller.subMasterSave);
router.post("/sub-master/delete", checkRightDelete('delete-sub-admin'), controller.subMasterDelete);

router.get("/sub-master/data/list", checkRight('list-sub-admin'), controller.subMasterDataList);
router.post("/sub-master/data/save", checkRightSave('add-sub-admin', 'edit-sub-admin'), subMasterDataValidation, controller.subMasterDataSave);
router.post("/sub-master/data/delete", checkRightDelete('delete-sub-admin'), controller.subMasterDataDelete);

module.exports = router;