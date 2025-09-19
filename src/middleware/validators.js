const validateCity = (req, res, next) => {
  const { city } = req.params;
  
  if (!city) {
    const error = new Error('City parameter is required');
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Basic city name validation
  if (city.length < 2 || city.length > 50) {
    const error = new Error('City name must be between 2 and 50 characters');
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Check for potentially malicious input
  const sanitizedCity = city.replace(/[^a-zA-Z0-9\s\-ăâîșțĂÂÎȘȚ]/g, '');
  if (sanitizedCity !== city) {
    const error = new Error('City name contains invalid characters');
    error.name = 'ValidationError';
    return next(error);
  }
  
  req.params.city = sanitizedCity;
  next();
};

const validateUserProfile = (req, res, next) => {
  const { userProfile } = req.body;
  
  if (!userProfile || typeof userProfile !== 'object') {
    const error = new Error('Valid user profile is required');
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Optional validation for specific profile fields
  const allowedFields = ['age', 'preferences', 'healthConditions', 'activities'];
  const profileKeys = Object.keys(userProfile);
  
  const invalidFields = profileKeys.filter(key => !allowedFields.includes(key));
  if (invalidFields.length > 0) {
    const error = new Error(`Invalid profile fields: ${invalidFields.join(', ')}`);
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
};

export { validateCity, validateUserProfile };
