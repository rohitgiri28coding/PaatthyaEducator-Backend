const { s3 } = require('../config/aws');
const { getFileExtension } = require('../utils/validators');
const createError = require('http-errors');

/**
 * Generate a unique file key for S3
 * @param {string} fileName - Original file name
 * @param {string} fileCategory - Category of file
 * @param {string} batchId - Optional batch ID
 * @param {string} fileType - MIME type of the file
 * @returns {string} - Unique file key
 */
const generateFileKey = (fileName, fileCategory, batchId, fileType) => {
  const timestamp = Date.now();
  const extension = getFileExtension(fileType);
  const sanitizedFileName = fileName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '')
    .toLowerCase();
  
  let key = `${fileCategory}/${timestamp}-${sanitizedFileName}`;
  
  // Add batch ID to key if provided
  if (batchId) {
    key = `${batchId}/${key}`;
  }
  
  // Add extension if not already in the filename
  if (!key.endsWith(`.${extension}`)) {
    key = `${key}.${extension}`;
  }
  
  return key;
};

/**
 * Generate pre-signed URL for S3 upload
 * @param {string} fileName - Original file name
 * @param {string} fileType - MIME type of the file
 * @param {string} fileCategory - Category of file
 * @param {string} batchId - Optional batch ID
 * @returns {Promise<Object>} - Object containing upload URL and file URL
 */
const generateUploadUrl = async (fileName, fileType, fileCategory, batchId) => {
  if (!fileName || !fileType || !fileCategory) {
    throw createError(400, 'Missing required fields: fileName, fileType, fileCategory');
  }
  
  const bucketName = process.env.S3_BUCKET_NAME;
  
  if (!bucketName) {
    throw createError(500, 'S3 bucket name not configured');
  }
  
  // Generate a unique key for the file
  const key = generateFileKey(fileName, fileCategory, batchId, fileType);
  
  // Parameters for the signed URL
  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    Expires: 60 * 15 // URL expires in 15 minutes
  };
  
  try {
    // Generate the presigned URL
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    
    // Generate the public URL for the file
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
    
    return {
      uploadUrl,
      fileUrl,
      key
    };
  } catch (error) {
    console.error('Error generating S3 presigned URL:', error);
    throw createError(500, 'Failed to generate upload URL');
  }
};

module.exports = {
  generateUploadUrl,
  generateFileKey
}; 