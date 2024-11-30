const { Router } = require('express');
const controller = require('./controller');
const { checkRight,checkRightDetail } = require('../../../middlewares/auth');
const router = Router({ mergeParams: true });


router.get('/list', checkRight('list-dealer'), controller.list);
router.get('/details/:_id', checkRightDetail('detail-dealer'), controller.details);

router.get('/market/list', controller.listMarketPlace);
router.get('/market/details/:dealerCarId', controller.detailsMarketPlace);
router.get('/market/offer/list', controller.listOffers);


router.get('/live-bid/list', controller.listLiveBid);
router.get('/live-bid/details/:_id', controller.detailsLiveBid);

router.get('/bid/list', controller.makeBidList);


module.exports = router;