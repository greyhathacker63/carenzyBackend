const { Router } = require('express');
const controller = require('./controller');

const router = Router(); // Instantiate the router

// Define the route
router.post('/createPromo', controller.create); // Correct path and usage

module.exports = router; // Export the router instance
