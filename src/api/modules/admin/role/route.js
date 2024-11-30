const { Router } = require('express');
const controller = require('./controller');
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { rolesValidation } = require('../../../middlewares/validation/roles');
// const { validateModuleSave, validateModule } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });


router.get('/list', validateToken, checkRight('super-admin-access-list'), controller.list);
router.post('/save', validateToken, rolesValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.save);
router.post('/delete', validateToken, checkRightDelete('super-admin-access-delete'), controller.delete);

module.exports = router;