const { Router } = require("express");
const controller = require("./controller");
const validation = require("../../../middlewares/validation/dealer");

const router = Router({ mergeParams: true });

router.post("/save", validation.dealerRating, controller.save);
router.post("/delete", validation.dealerRatingDelete, controller.delete);
router.get("/:toDealerId/list", controller.list);
router.get('/:toDealerId/avg', controller.avg);


module.exports = router;