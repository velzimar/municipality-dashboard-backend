const express = require('express');
const router = express.Router();
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');

const stepController = require('../controllers/step');

router.post('/createStep',checkAuthsuperadmin, stepController.step_create_step);
router.delete('/deleteStep',checkAuthsuperadmin, stepController.step_delete_step);
router.delete('/deleteallStep',checkAuthsuperadmin, stepController.step_deleteall_step);
router.get('/getStep',checkAuthsuperadmin, stepController.step_getall_step);
module.exports= router;