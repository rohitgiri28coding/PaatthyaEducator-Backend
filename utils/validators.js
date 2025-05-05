/**
 * Validate file type based on category
 * @param {string} fileType - MIME type of the file
 * @param {string} fileCategory - Category of file (lecture, notes, assignment, notice)
 * @returns {boolean} - Whether file type is valid for the category
 */
const validateFileType = (fileType, fileCategory) => {
  const allowedTypes = {
    lecture: ['video/mp4', 'video/x-matroska', 'video/quicktime'],
    notes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'],
    assignment: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'],
    notice: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg']
  };

  if (!fileCategory || !allowedTypes[fileCategory]) {
    return false;
  }

  return allowedTypes[fileCategory].includes(fileType);
};

/**
 * Get file extension from MIME type
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - File extension
 */
const getFileExtension = (mimeType) => {
  const mimeToExtension = {
    'video/mp4': 'mp4',
    'video/x-matroska': 'mkv',
    'video/quicktime': 'mov',
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
  };

  return mimeToExtension[mimeType] || '';
};

module.exports = {
  validateFileType,
  getFileExtension
}; 