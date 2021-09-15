const express = require('express');
const router = express.Router();
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');
const checkAuthadmin = require('../middleware/check-auth-admin');
const checkAuthagent = require('../middleware/check-auth-agent');
const fileController = require('../controllers/file');


router.post("/createFile",/*checkAuthagent,*/fileController.file_create_file);
router.post("/createFileDetails",checkAuthagent,fileController.file_create_file_details);
router.post('/getFile',checkAuthagent,fileController.file_get_file);
router.patch('/updateFile',/*checkAuthagent,*/fileController.file_update_file);


router.post('/getFileByCreationDate'/*,checkAuthagent*/,fileController.file_count_by_creationDate);
router.post('/getFileCreatedBetween'/*,checkAuthagent*/,fileController.files_count_byCreationDate_between);

router.post('/getFileByUpdateDate'/*,checkAuthagent*/,fileController.file_count_by_updateDate);
//router.post('/getFileUpdatedBetween'/*,checkAuthagent*/,fileController.files_count_byUpdateDate_between);
router.post('/getFileLogByFileId'/*,checkAuthagent*/,fileController.get_filelog_by_fileId);

//router.post("/createFileLog"/*,checkAuthagent*/,fileController.file_create_fileLog);

module.exports = router;
