const express = require('express');
const uploadController = require('../Controllers/uploadController');
const router = express.Router();

router.post('/image', uploadController.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;