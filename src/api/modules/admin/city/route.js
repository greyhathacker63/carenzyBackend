const { Router } = require('express');
const controller = require('./controller');
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const { cityValidation } = require("../../../middlewares/validation/city");

const router = Router({ mergeParams: true });


router.get('/list', validateToken, checkRight('list-city'), controller.list);
router.get('/details/:_id', validateToken, checkRightDetail('add-city'), controller.details);
router.post('/save', validateToken, cityValidation, checkRightSave('add-city', 'edit-city'), controller.save);
router.post('/delete', validateToken, checkRightDelete('delete-city'), controller.delete);

module.exports = router;