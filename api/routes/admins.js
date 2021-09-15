const express = require('express');
const router = express.Router();
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');
const checkAuthadmin = require('../middleware/check-auth-admin');
const adminController = require('../controllers/admin');



router.post("/signup" ,/*checkAuthsuperadmin,*/adminController.admin_signup_admin);
router.post("/login", adminController.admin_login_admin);
router.get("/getAdmin",checkAuthsuperadmin, adminController.admin_get_admin);
router.patch("/patchAdmin",checkAuthsuperadmin,adminController.admin_patch_admin);
router.delete("/deleteAdmin",checkAuthsuperadmin,adminController.admin_delete_admin );

router.get("/getSuperadmins",checkAuthsuperadmin, adminController.admin_get_and_count_superadmins);
router.get("/getSupervisors",checkAuthsuperadmin, adminController.admin_get_and_count_supervisors);

module.exports = router;