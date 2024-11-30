const { Router } = require("express");
const controller = require("./controller");
const { validateToken } = require('../../../middlewares/authFront');
const router = Router({ mergeParams: true });

router.get('/details/:_id', controller.details);
router.get('/list', controller.list);
router.post('/like', validateToken, controller.updateDealerLikes);
router.post('/like-multiple', validateToken, controller.updateDealerLikesMultiple);
router.post('/bookmark', validateToken, controller.updateDealerBookmark);
router.post('/bookmark-multiple', validateToken, controller.updateDealerBookmarkMultiple);
router.get('/bookmark-list', validateToken, controller.listBookmarks);

module.exports = router;