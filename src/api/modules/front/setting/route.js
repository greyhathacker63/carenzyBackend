const { Router } = require('express');
const controller = require('./controller');
const router = Router({ mergeParams: true });

router.get("/application/:type?", controller.detailsApplication);
router.get("/contactus", controller.listContactus);
router.get("/metadata/:type", controller.list);

router.get("/video-tutorial-urls", controller.listVideoTutorial);

module.exports = router;