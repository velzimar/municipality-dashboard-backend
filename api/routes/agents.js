const express = require('express');
const router = express.Router();
const checkAuthadmin = require('../middleware/check-auth-admin');
const agentController = require('../controllers/agent');
const checkAuthsuperadmin = require('../middleware/check-auth-superadmin');

router.post("/signup" ,/*checkAuthadmin,*/agentController.agents_signup_agent);
router.post("/login" ,agentController.agents_login_agent);
router.post("/getAgent"/*,checkAuthsuperadmin,*/, agentController.agent_get_agent);
router.post("/getAgentByMunicipality",checkAuthadmin, agentController.agents_get_agent_bymunicipality);
router.post("/changeAgentState", agentController.agents_delete_agent);
router.post("/updateAgent"/*,checkAuthadmin*/, agentController.agents_update_agent);


//router.get("/getCountAll",agentController.agents_count_all);
//router.post("/getCountByMunicipality",agentController.agents_count_by_municipality);
router.post("/getByLastLoginDate",checkAuthadmin,agentController.agent_count_by_lastLoginDate);
router.post("/getByLastLoginDateByMunicipality",checkAuthadmin, agentController.agent_count_by_RangedlastLoginDate_By_municipality);
router.post("/getByRangedLastLoginDate",checkAuthadmin,agentController.agent_count_by_lastLoginDate);
router.post("/getByRangedLastLoginDateByMunicipality",checkAuthadmin, agentController.agent_count_by_RangedlastLoginDate_By_municipality);


module.exports = router;