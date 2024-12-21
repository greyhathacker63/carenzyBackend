const { Router } = require('express');
const pollController = require('./controller');

const router = Router();

router.post('/save', pollController.save);
router.get('/detail', pollController.detail)
router.put('/increaseCount', pollController.increaseCount)

module.exports = router;
