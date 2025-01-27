const { Router } = require("express");
const controller = require("./controller");
const router = Router({ mergeParams: true });

router.get('/list', controller.list);
router.post('/save',controller.save)
router.put('/update',controller.update)
router.delete('/delete',controller.delete)

module.exports = router;