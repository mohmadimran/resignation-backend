const express = require('express');
const { isAdmin } = require('../middleware/auth.js');
const { 
  getAllResignations, 
  concludeResignation, 
  getExitResponses 
} = require('../controllers/adminController.js');

const router = express.Router();

router.get('/resignations', isAdmin, getAllResignations);
router.put('/conclude_resignation', isAdmin, concludeResignation);
router.get('/exit_responses', isAdmin, getExitResponses);

module.exports= router;
