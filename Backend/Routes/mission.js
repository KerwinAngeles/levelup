const express = require('express');
const router = express.Router();
const missionController = require('../Controllers/missionController');
const authenticateMiddleware = require('../Middleware/authenticationToken');

router.post('/create', authenticateMiddleware, missionController.createMission);
router.put('/edit/:id', authenticateMiddleware, missionController.updateMission);
router.delete('/delete/:id', authenticateMiddleware, missionController.deleteMission);
router.get('/all', authenticateMiddleware, missionController.getAllMissions);
router.get('/xp-stats', authenticateMiddleware, missionController.getUserXPStats);

module.exports = router;