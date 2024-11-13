const express = require("express");
const router = express.Router();
const teamMembersController = require("../controllers/teamMembersController");

router.get("/getAllTeamMembers", teamMembersController.getAllTeamMembers);
router.post("/saveTeamMember", teamMembersController.saveTeamMember);
router.put("/editTeamMember/:id", teamMembersController.updateTeamMember);
router.delete("/deleteTeamMember/:id", teamMembersController.deleteTeamMember);
router.post("/saveClientInfo",teamMembersController.saveClientDetails)

module.exports = router;
