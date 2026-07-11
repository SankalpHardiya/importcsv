const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');

// POST /api/csv/upload
router.post('/upload', csvController.uploadAndProcessCSV);

module.exports = router;