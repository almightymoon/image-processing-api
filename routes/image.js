// routes/image.js
const express = require('express');
const router = express.Router();
const { processImage } = require('../controllers/imageController');

router.post('/process', processImage);

module.exports = router;
