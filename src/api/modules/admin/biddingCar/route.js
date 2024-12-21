const Router = require('express')
const router = Router({mergeParms: true})
const bidController = require('./controller')

router.post('/create',bidController.save)