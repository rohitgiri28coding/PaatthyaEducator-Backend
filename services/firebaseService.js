const { getFirestore } = require('../config/firebase');
const createError = require('http-errors');

/**
 * Update or create a document in Firestore with file reference
 * @param {string} fileCategory - Category of the file (lecture, notes, assignment, notice)
 * @param {string} batchId - Batch ID for linking
 * @param {string} fileUrl - URL of the file in S3
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} - The created or updated document
 */
const saveFileReference = async (fileCategory, batchId, fileUrl, fileName) => {
  if (!fileUrl || !fileCategory || !batchId) {
    throw createError(400, 'Missing required fields: fileUrl, fileCategory, batchId');
  }

  try {
    const db = getFirestore();
    const collectionName = getCollectionForCategory(fileCategory);
    const timestamp = new Date();
    
    // Document data
    const fileData = {
      fileName,
      fileUrl,
      category: fileCategory,
      batchId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Save to Firestore based on the category
    let docRef;
    
    // Create a unique document ID if not existing
    docRef = db.collection(collectionName).doc();
    await docRef.set(fileData);
    
    return {
      id: docRef.id,
      ...fileData
    };
  } catch (error) {
    console.error('Error saving file reference to Firestore:', error);
    throw createError(500, 'Failed to save file reference to database');
  }
};

/**
 * Get the appropriate collection name for the file category
 * @param {string} fileCategory - Category of the file
 * @returns {string} - Collection name
 */
const getCollectionForCategory = (fileCategory) => {
  const collections = {
    lecture: 'lectures',
    notes: 'notes',
    assignment: 'assignments',
    notice: 'notices'
  };
  
  return collections[fileCategory] || 'files';
};

module.exports = {
  saveFileReference
}; 