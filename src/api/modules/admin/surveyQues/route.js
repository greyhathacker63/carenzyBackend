const { Router } = require('express');
const controller = require('./controller');
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { surveyQuesValidation } = require('../../../middlewares/validation/survey');

const router = Router({ mergeParams: true });


router.get('/list', validateToken, checkRight('super-admin-access-list'), controller.list);
router.get('/details/:_id', validateToken, checkRightDetail('super-admin-access-list'), controller.details);
router.post('/save', validateToken, surveyQuesValidation, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), controller.save);
router.post('/delete', validateToken, checkRightDelete('super-admin-access-delete'), controller.delete);

module.exports = router;