const { Router } = require('express');
const PollController = require('./controller'); 

const router = Router();

router.post('/save', PollController.save);

module.exports = router;