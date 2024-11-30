const { Router } = require("express");
const controller = require("./controller");
const { feedbackForm } = require('../../middlewares/validation/feedback');

const router = Router({ mergeParams: true });

router.get("/application/:type", controller.applicationData);


router.get('/feedback-form', controller.feedbackForm);
router.post('/save-feedback', feedbackForm, controller.saveFeedback);

router.get('/keyenzy/feedback-form', controller.feedbackFormKeyenzy);

router.get('/dealer-car/market/list', controller.listMarketPlace);
module.exports = router;