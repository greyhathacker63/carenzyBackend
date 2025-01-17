const controller  = require('./controller')
const {Router} = require('express')
const router = Router({mergeparams: true})

router.post('/save',controller.save)
router.get('/details',controller.details)


module.exports= router