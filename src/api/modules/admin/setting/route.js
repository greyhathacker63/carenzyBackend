const { Router } = require('express');
const controller = require('./controller');
const { applicationValidation } = require('../../../middlewares/validation/application');
const { saveValidation: saveValidationConfiguration } = require('../../../middlewares/validation/configuration');
const { metadataValidation } = require('../../../middlewares/validation/metadata');
const { contactUsValidation } = require('../../../middlewares/validation/contact-us');

const router = Router({ mergeParams: true });

/**
 * Application APIs
 **/

router.get("/application/details/:type", controller.detailsApplication);
router.post("/application/save", applicationValidation, controller.saveApplication);
router.get("/application/list", controller.listApplication);

/**
 * Contactus APIs
 **/

router.get("/contact-us/details/:type", controller.detailsContactus);
router.post("/contact-us/save", contactUsValidation, controller.saveContactus);
router.get("/contact-us/list", controller.listContactus);

/**
 * Dealer Doc Type APIs
 **/

router.post("/metadata/save", metadataValidation, controller.saveMetadata);
router.get("/metadata/list", controller.listMetadata);
router.post("/metadata/delete", controller.deleteMetadata);

/**
 * Report Problem APIs
 **/

router.get("/report-problem/list", controller.reportProblemList);
router.post("/report-problem/delete", controller.reportProblemDelete);


/**
 * Configuration APIs
 **/

router.get("/configuration/details/:type", controller.detailsConfiguration);
router.post("/configuration/save", saveValidationConfiguration, controller.saveConfiguration);
router.get("/configuration/list", controller.listConfiguration);
router.post("/configuration/update-market-car-count", controller.updateMarketCarCount);

module.exports = router;