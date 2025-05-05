const express = require('express');
const router = express.Router();
const { 
  generateUploadUrlHandler,
  confirmUploadHandler
} = require('../controllers/uploadController');

// Route to generate presigned URL for S3 upload
router.post('/generate-upload-url', generateUploadUrlHandler);

// Route to confirm upload and save reference to Firestore
router.post('/confirm-upload', confirmUploadHandler);

module.exports = router; 