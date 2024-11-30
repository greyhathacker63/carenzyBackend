const { Router } = require("express");
const controller = require("./controller");
const router = Router({ mergeParams: true });



// Route for Banners 
router.get('/list/:position', controller.bannerList);



module.exports = router;