const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('./controller');

router.post('/save', controller.save);
router.get('/list', controller.list);
router.put('/delete', controller.delete)


module.exports = router;
