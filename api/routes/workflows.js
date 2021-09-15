const express = require('express');
const router = express.Router();
const workflowController = require ('../controllers/workflow');


router.post("/createWorkflow", workflowController.workflow_create_workflow);
//router.post("/createManyWorkflows", workflowController.workflow_create_workflows);//test
router.post("/getWorkflow", workflowController.workflow_get_workflow);
router.post("/getWorkflowByMunicipality", workflowController.workflow_getall_workflow_by_municipalityId);

//router.get("/getCountAll",workflowController.workflow_count_all);
//router.post("/getCountByMunicipality",workflowController.workflow_count_by_municipality);
router.post("/getBycreationDate",workflowController.workflow_count_by_creationDate);
router.post("/getByRangedDate",workflowController.workflow_count_inRangeDate);
router.post("/getBycreationDateByMunicipality",workflowController.workflow_count_by_creationDate_by_municipality);
router.post("/getByRangedDateByMunicipality",workflowController.workflow_count_inRangeDate_ByMunicipality);




module.exports= router;