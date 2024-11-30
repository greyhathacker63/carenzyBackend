const { Router } = require('express');
const controller = require('./controller');
const validation = require('../../../middlewares/validation/admin');
const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const masterAdmin = require('../../../../models/admin');
const { dealerFromAdmin } = require('../../../middlewares/validation/dealer');

const router = Router({ mergeParams: true });

router.post('/login', validation.login, controller.login);
router.post('/validate-token', validateToken, controller.validateToken);
router.post('/update-password', validateToken, validation.updatePassword, controller.updatePassword);
router.get('/profile', validateToken, controller.profile);
router.post('/save-profile', validateToken, validation.updateSuperAdmin, controller.saveProfile);
router.post('/change-avatar', validateToken, controller.changeAvatar);

///// Sub-Admin route
router.get('/list', validateToken, checkRight('super-admin-access-list'), controller.list);
router.post('/save', validateToken, validation.subAdmin, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), validation.subAdmin, controller.save);
router.post('/delete', validateToken, checkRightDelete('super-admin-access-delete'), controller.delete);

//// admin save user route
router.get('/list-dealer', validateToken, checkRight('list-dealer'), controller.listDealer);
router.post('/save-dealer', validateToken, dealerFromAdmin, checkRightSave('add-dealer', 'edit-dealer'), controller.saveDealer);
router.get('/details-dealer/:_id', validateToken, checkRightDetail('detail-dealer'), controller.detailsDealer);
router.post('/delete-dealer', validateToken, checkRightDelete('delete-dealer'), controller.deleteDealer);
router.get('/get-next-crz-no', validateToken, checkRight('list-dealer'), controller.generateNextCRZNumber);


router.get('/init-admin', async (req, res) => {
    const docData = new masterAdmin();
    docData.firstName = 'Mukesh';
    docData.lastName = 'Jain';
    docData.email = 'admin@test.com';
    docData.phone = '8826648669';
    docData.password = 'admin';
    docData.type = 'superAdmin';
    await docData.save();

    res.send('success');
});

module.exports = router;