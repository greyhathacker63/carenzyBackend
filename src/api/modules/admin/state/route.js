const { Router } = require('express');
const controller = require('./controller');
const { stateValidation } = require("../../../middlewares/validation/state")
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');

const router = Router({ mergeParams: true });


router.get('/list', validateToken, checkRight('list-location'), controller.list);
router.get('/details/:_id', validateToken, checkRightDetail('list-location'), controller.details);
router.post('/save', validateToken, stateValidation, checkRightSave('add-location', 'edit-location'), controller.save);
router.post('/delete', validateToken, checkRightDelete('delete-location'), controller.delete);

module.exports = router;