const express = require('express');
const router = express.Router();
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');

const conditionController = require('../controllers/condition');

router.post('/createCondition',checkAuthsuperadmin, conditionController.condition_create_condition);
router.delete('/deleteCondition',checkAuthsuperadmin, conditionController.condition_delete_condition);
router.delete('/deleteallCondition',checkAuthsuperadmin, conditionController.condition_deleteall_condition);
router.get('/getCondition',checkAuthsuperadmin, conditionController.condition_getall_condition);

module.exports= router;