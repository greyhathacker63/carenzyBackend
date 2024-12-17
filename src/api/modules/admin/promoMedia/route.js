const { Router } = require('express');
const controller = require('./controller');

const router = Router(); // Instantiate the router

router.post('/createPromo', controller.create);
router.get('/list',controller.list)

module.exports = router; 
