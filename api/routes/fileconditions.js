const express = require('express');
const router = express.Router();
const fileconditionController = require('../controllers/filecondition');


router.post('/createfileconditions', fileconditionController.filecondition_create_filecondition);
router.patch('/updatefileconditions', fileconditionController.filecondition_update_filecondition);
router.get('/getfileconditions', fileconditionController.filecondition_get_filecondition);

router.post('/getfileconditionsByFile', fileconditionController.filecondition_get_filecondition_byFile);


module.exports = router;
