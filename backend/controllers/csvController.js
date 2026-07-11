const multer = require('multer');
const Papa = require('papaparse');
const { processRecordsInBatches } = require('../services/aiService');

// Setup Multer to handle file uploads in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

// Middleware to handle the actual file upload
exports.uploadAndProcessCSV = [
  upload.single('csvFile'),
  
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No CSV file uploaded.' });
      }

      // 1. Parse CSV
      const csvString = req.file.buffer.toString('utf-8');
      const parsedCSV = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      const records = parsedCSV.data;

      if (records.length === 0) {
        return res.status(400).json({ success: false, error: 'CSV file is empty.' });
      }

      console.log(`✅ Parsed ${records.length} rows. Sending to Gemini AI...`);

      // 2. Process with AI (Handles batching and retries internally)
      const result = await processRecordsInBatches(records);

      console.log(`🎉 Processing complete! Imported: ${result.totalImported}, Skipped: ${result.totalSkipped}`);

      // 3. Return structured response to Frontend
      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Fatal Error processing CSV:', error);
      
      if (error.message === 'Only CSV files are allowed!') {
        return res.status(400).json({ success: false, error: error.message });
      }
      
      return res.status(500).json({ success: false, error: 'An unexpected error occurred while processing.' });
    }
  }
];