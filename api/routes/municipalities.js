const express = require('express');
const router = express.Router();
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');
const checkAuthadmin = require('../middleware/check-auth-admin');
const municipalityController = require('../controllers/municipality');

router.get('/getMunicipality', checkAuthsuperadmin,  municipalityController.municipalities_get_municipality);

router.post('/createMunicipality', checkAuthsuperadmin,municipalityController.municipalities_create_municipality);

router.delete('/deleteMunicipality', checkAuthsuperadmin, municipalityController.municipalities_delete_municipality);

router.patch('/patchMunicipality', checkAuthsuperadmin, municipalityController.municipalities_patch_municipality);


router.post('/getMunicipalityByCreationDate', checkAuthsuperadmin ,municipalityController.municipality_count_by_creationDate);

router.post('/getMunicipalityByRangedDate', checkAuthsuperadmin, municipalityController.municipality_count_inRangeDate);



module.exports = router;
