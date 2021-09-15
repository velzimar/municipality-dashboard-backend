const express = require('express');
const router = express.Router();
const filepieceController = require('../controllers/filepiece');


router.post('/createfilepieces', filepieceController.filepiece_create_filepiece);
router.patch('/updatefilepieces', filepieceController.filepiece_update_filepiece);
router.get('/getfilepieces', filepieceController.filepiece_get_filepiece);

router.post('/getfilepiecesByFile', filepieceController.filepiece_get_filepiece_ByFile);
module.exports = router;
