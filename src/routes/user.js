const express = require('express');
const { isEmployee } = require('../middleware/auth.js');
const {getUserDetails, submitResignation, resignationStatus } = require('../controllers/userController.js');
const router = express.Router();

router.get('/me',isEmployee,getUserDetails)
router.post('/resign', isEmployee, submitResignation);
router.get('/resign-status', isEmployee, resignationStatus);

module.exports= router;
