const { Router } = require('express')
const router = Router({ mergeParams: true })
const controller = require('./controller')

router.post('/save', controller.save)
router.get('/detail', controller.detail)
router.delete('/delete', controller.delete)
router.put('/edit', controller.edit)

module.exports = router

