/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default status code and message
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error for server-side debugging
  console.error(`Error ${statusCode}: ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler; 