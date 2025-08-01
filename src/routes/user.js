const express = require('express');
const { isEmployee } = require('../middleware/auth.js');
const { submitResignation, submitExitResponses } = require('../controllers/userController.js');
const router = express.Router();

router.post('/resign', isEmployee, submitResignation);
router.post('/responses', isEmployee, submitExitResponses);

module.exports= router;
