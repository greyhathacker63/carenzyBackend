const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('./controller');

router.post('/save', controller.save);
router.get('/list', controller.list);

module.exports = router;
