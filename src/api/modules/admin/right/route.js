const { Router } = require('express');
const controller = require('./controller');
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { rightsValidation } = require('../../../middlewares/validation/right');
// const { validateModuleSave, validateModule } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });


router.get('/list', validateToken, checkRight('super-admin-access-list'), controller.list);
router.post('/save', validateToken, rightsValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.save);
router.post('/delete', validateToken, checkRightDelete('super-admin-access-list'), controller.delete);

module.exports = router;