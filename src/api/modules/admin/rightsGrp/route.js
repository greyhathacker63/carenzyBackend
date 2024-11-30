const { Router } = require('express');
const controller = require('./controller');
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { rightsGrpValidation } = require('../../../middlewares/validation/rightsGroup');
// const { validateModuleSave, validateModule } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });


router.get('/list', validateToken, checkRight('super-admin-access-list'), controller.list);
router.get('/list-with-rights', validateToken, checkRight('super-admin-access-list'), controller.listWithRights);
router.post('/save', validateToken,rightsGrpValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.save);
router.post('/delete', validateToken, checkRightDelete('super-admin-access-delete'), controller.delete);

module.exports = router;