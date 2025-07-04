const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const profileController = require('../Controllers/ProfileController');
const upload = require('../Controllers/uploadController');
const authenticateToken = require('../Middleware/authenticationToken');

router.get('/getProfile', authenticateToken, profileController.getProfile);
router.put('/updateProfile', authenticateToken, upload.single('profileImage'), profileController.editProfile);

module.exports = router