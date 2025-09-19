const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // API key errors
  if (err.message.includes('API key')) {
    return res.status(401).json({
      success: false,
      error: 'API Configuration Error',
      message: 'Service temporarily unavailable'
    });
  }

  // City not found errors
  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: 'City Not Found',
      message: err.message
    });
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: err.retryAfter
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

export { errorHandler };
