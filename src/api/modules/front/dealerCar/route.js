const { Router } = require('express');
const controller = require('./controller');
const { dealerCarValidation, dealerCarMarketOfferPlaceValidation, dealerCarMarketSoldValidation, dealerCarRemoveValidation } = require("../../../middlewares/validation/dealerCar");
const router = Router({ mergeParams: true });
const { biddingValidation, verifyDealerCarAndBidAmount, biddingDeleteValidation } = require('../../../middlewares/validation/bidding');
const { verificationCheck } = require("../../../middlewares/authFront");

router.get('/sold/list', controller.list);
router.get('/market/list', controller.listMarketPlace);
router.get('/market/update-table', controller.saveDealerCarKeys);
router.get('/live-bid/list', controller.listLiveBid);
router.get('/location/list', controller.listDistinctLocation);

router.use(verificationCheck);

router.post('/save', dealerCarValidation, controller.save);
router.post('/delete', controller.delete);
router.post('/like', controller.updateDealerCarLikes);
router.post('/like-multiple', controller.updateDealerCarLikesMultiple);
router.post('/bookmark', controller.updateDealerCarBookmark);
router.post('/bookmark-multiple', controller.updateDealerCarBookmarkMultiple);

router.post('/make-sold', dealerCarMarketSoldValidation, controller.makeSold);
router.post('/make-removed', dealerCarRemoveValidation, controller.makeRemoved);
router.post('/make-in-list', dealerCarMarketSoldValidation, controller.makeInList);

router.get('/market/details/:_id', controller.detailsMarketPlace);
router.post('/market/offer/place', dealerCarMarketOfferPlaceValidation, controller.makeOffer);
router.get('/market/offer/list', controller.listOffers);

router.get('/live-bid/details/:_id', controller.detailsLiveBid);

router.post('/bid/make', biddingValidation, verifyDealerCarAndBidAmount, controller.makeBidSave);
router.post('/bid/delete', biddingDeleteValidation, controller.bidDelete);
router.get('/bid/list', controller.makeBidList);
router.get('/bid/details/:_id', controller.makeBidDetails);


module.exports = router;