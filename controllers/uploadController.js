const { validateFileType } = require('../utils/validators');
const { generateUploadUrl } = require('../services/awsService');
const { saveFileReference } = require('../services/firebaseService');
const createError = require('http-errors');

/**
 * Generate a pre-signed URL for S3 upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const generateUploadUrlHandler = async (req, res, next) => {
  try {
    const { fileName, fileType, fileCategory, batchId } = req.body;
    
    // Validate required fields
    if (!fileName || !fileType || !fileCategory) {
      return next(createError(400, 'Missing required fields: fileName, fileType, fileCategory'));
    }
    
    // Validate file type based on category
    if (!validateFileType(fileType, fileCategory)) {
      return next(createError(400, `Invalid file type ${fileType} for category ${fileCategory}`));
    }
    
    // Generate upload URL
    const { uploadUrl, fileUrl, key } = await generateUploadUrl(
      fileName,
      fileType,
      fileCategory,
      batchId
    );
    
    // Send response
    res.status(200).json({
      uploadUrl,
      fileUrl,
      key,
      message: 'Pre-signed URL generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm upload and save to Firestore
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const confirmUploadHandler = async (req, res, next) => {
  try {
    const { fileUrl, fileCategory, batchId, fileName } = req.body;
    
    // Validate required fields
    if (!fileUrl || !fileCategory || !batchId || !fileName) {
      return next(createError(400, 'Missing required fields: fileUrl, fileCategory, batchId, fileName'));
    }
    
    // Save file reference to Firestore
    const fileData = await saveFileReference(fileCategory, batchId, fileUrl, fileName);
    
    // Send response
    res.status(200).json({
      message: 'File reference saved successfully',
      data: fileData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateUploadUrlHandler,
  confirmUploadHandler
}; 