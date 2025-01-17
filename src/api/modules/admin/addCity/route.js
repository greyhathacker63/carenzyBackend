const controller  = require('./controller')
const {Router} = require('express')
const router = Router({mergeparams: true})

router.post('/save',controller.save)


module.exports= router