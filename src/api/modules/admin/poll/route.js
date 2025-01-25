const { Router } = require('express');
const pollController = require('./controller');

const router = Router({ mergeParams: true });

router.post('/save', pollController.save);
router.get('/detail', pollController.detail)
router.put('/increaseCount', pollController.increaseCount)
router.put('/edit', pollController.edit)

module.exports = router;
