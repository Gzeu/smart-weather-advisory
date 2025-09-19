/**
 * Convert temperature from Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

/**
 * Convert wind speed from m/s to km/h
 * @param {number} mps - Wind speed in meters per second
 * @returns {number} Wind speed in kilometers per hour
 */
export const mpsToKmh = (mps) => {
  return mps * 3.6;
};

/**
 * Get wind direction from degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Wind direction as compass point
 */
export const getWindDirection = (degrees) => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  return directions[Math.round(degrees / 22.5) % 16];
};

/**
 * Format date for Romanian locale
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatRomanianDate = (date) => {
  return date.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate heat index
 * @param {number} temperature - Temperature in Celsius
 * @param {number} humidity - Relative humidity percentage
 * @returns {number} Heat index in Celsius
 */
export const calculateHeatIndex = (temperature, humidity) => {
  const T = celsiusToFahrenheit(temperature);
  const RH = humidity;
  
  if (T < 80) return temperature;
  
  const HI = -42.379 + 2.04901523 * T + 10.14333127 * RH
    - 0.22475541 * T * RH - 6.83783e-3 * T * T
    - 5.481717e-2 * RH * RH + 1.22874e-3 * T * T * RH
    + 8.5282e-4 * T * RH * RH - 1.99e-6 * T * T * RH * RH;
  
  return (HI - 32) * 5/9; // Convert back to Celsius
};

/**
 * Determine clothing recommendations based on temperature
 * @param {number} temperature - Temperature in Celsius
 * @param {number} windSpeed - Wind speed in m/s
 * @param {boolean} isRaining - Whether it's raining
 * @returns {Array} Array of clothing recommendations
 */
export const getClothingRecommendations = (temperature, windSpeed, isRaining) => {
  const recommendations = [];
  
  // Base layer recommendations
  if (temperature < 0) {
    recommendations.push('Lenjerie termică', 'Geacă groasă de iarnă');
  } else if (temperature < 10) {
    recommendations.push('Pulover gros', 'Jachetă de iarnă');
  } else if (temperature < 20) {
    recommendations.push('Bluzană', 'Jachetă ușoară');
  } else {
    recommendations.push('Tricou');
  }
  
  // Wind protection
  if (windSpeed > 8) {
    recommendations.push('Jachetă rezistentă la vânt');
  }
  
  // Rain protection
  if (isRaining) {
    recommendations.push('Impermeabil', 'Umbrelă');
  }
  
  // Accessories
  if (temperature < 5) {
    recommendations.push('Căciulă', 'Mănuși', 'Fular');
  }
  
  if (temperature > 25) {
    recommendations.push('Pălărie de soare', 'Ochelari de soare');
  }
  
  return recommendations;
};

/**
 * Generate activity recommendations based on weather
 * @param {Object} weather - Weather data object
 * @returns {Object} Object with indoor and outdoor activity recommendations
 */
export const getActivityRecommendations = (weather) => {
  const { temperature, description, windSpeed, humidity } = weather;
  const isRaining = description.toLowerCase().includes('ploaie') || description.toLowerCase().includes('rain');
  
  const activities = {
    outdoor: [],
    indoor: [],
    cautions: []
  };
  
  // Perfect weather activities
  if (temperature >= 18 && temperature <= 26 && !isRaining && windSpeed < 6) {
    activities.outdoor.push(
      'Plimbare în parc',
      'Ciclism',
      'Jogging',
      'Picnic',
      'Fotografie exterior'
    );
  }
  
  // Hot weather activities
  if (temperature > 26) {
    activities.outdoor.push('Piscină', 'Terasă cu umbră', 'Plajă');
    activities.cautions.push('Evitați expunerea prelungită la soare');
  }
  
  // Cold weather activities
  if (temperature < 10) {
    activities.indoor.push(
      'Muzeu',
      'Mall',
      'Cafenea',
      'Cinema',
      'Bibliotecă'
    );
    if (temperature < 0) {
      activities.cautions.push('Risc de îngheț pe străzi');
    }
  }
  
  // Rainy weather
  if (isRaining) {
    activities.indoor.push(
      'Shopping indoor',
      'Galerii de artă',
      'Cafenea',
      'Spa/wellness'
    );
    activities.cautions.push('Drumuri alunecoase');
  }
  
  // Windy weather
  if (windSpeed > 10) {
    activities.cautions.push('Vânt puternic - atenție la obiecte volatile');
  }
  
  // High humidity
  if (humidity > 80) {
    activities.cautions.push('Umiditate ridicată - disconfort termic');
  }
  
  return activities;
};

/**
 * Log API usage for monitoring
 * @param {string} endpoint - API endpoint called
 * @param {string} city - City requested
 * @param {number} responseTime - Response time in ms
 */
export const logApiUsage = (endpoint, city, responseTime) => {
  console.log(`API Usage: ${endpoint} | City: ${city} | Response: ${responseTime}ms | Time: ${new Date().toISOString()}`);
};
