const { Router } = require("express");
const controller = require("./controller");
const { validateToken } = require('../../../middlewares/authFront');
const { subscriptionPurcahse, setLastDateForTheSubscription, verifyPayment } = require("../../../middlewares/validation/subscription");

const router = Router({ mergeParams: true });

router.get("/list", validateToken, controller.subscriptionList);
router.post("/purchase-init", validateToken, subscriptionPurcahse, setLastDateForTheSubscription, controller.purchaseSubscriptionInit);
router.get("/details/:_id", validateToken, controller.subscriptionDetails);
router.get("/get-last-date", validateToken, controller.getDealerLastSubscriptionDate);

router.post("/purchase-mob", validateToken, verifyPayment, controller.purchaseSubscriptionMob);
router.post("/purchase", controller.purchaseSubscription);

module.exports = router;