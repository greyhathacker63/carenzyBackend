const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.post('/createPromo', controller.create);
router.get('/list',controller.list)
router.get('/lists', controller.lists)
router.put('/editList', controller.editList)
router.put('/remove', controller.removeList)

module.exports = router; 
