const express = require('express');
const router = express.Router();
const awardController = require('../Controllers/awardController');
const authenticateMiddleware = require('../Middleware/authenticationToken');

router.get('/all', authenticateMiddleware, awardController.getAllAwards);
router.get('/allCount', authenticateMiddleware, awardController.getAllAwardsCount);
router.post('/check', authenticateMiddleware, awardController.checkAwards);

module.exports = router;