const { Router } = require('express');
const controller = require('./controller');
const { validateToken, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { bannerValidation } = require("../../../middlewares/validation/banner");
const router = Router({ mergeParams: true });


router.post('/save', bannerValidation, checkRightSave('add-sub-admin', 'edit-sub-admin'), controller.bannerSave);
router.get('/list', checkRight('list-sub-admin'), controller.bannerList);
router.get('/details/:_id', checkRightDetail('detail-sub-admin'), controller.bannerDetails);
router.post('/delete', checkRightDelete('delete-sub-admin'), controller.bannerDelete);


module.exports = router