const express = require('express');
const bidController = require('./controller');

const router = express.Router({ mergeParams: true });
router.post('/save', bidController.save);
router.get('/detail', bidController.detail);

module.exports = router;