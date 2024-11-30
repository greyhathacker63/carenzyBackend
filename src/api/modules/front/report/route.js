const { Router } = require('express');
const controller = require('./controller');
const { reportValidation } = require('../../../middlewares/validation/report-problem');
const router = Router({ mergeParams: true });

router.get('/list', controller.list);
router.get('/details/:_id', controller.details);
router.post('/save', reportValidation, controller.save);
router.post('/delete', controller.delete);

module.exports = router;