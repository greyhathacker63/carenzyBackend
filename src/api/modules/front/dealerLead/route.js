const { Router } = require('express');
const controller = require('./controller');
const { dealerPhoneLeadValidation } = require("../../../middlewares/validation/dealerLead");
const router = Router({ mergeParams: true });
// const { verificationCheck } = require("../../../middlewares/authFront");
// router.use(verificationCheck);

router.get('/list', controller.list);
router.post('/save', dealerPhoneLeadValidation, controller.save);


module.exports = router;