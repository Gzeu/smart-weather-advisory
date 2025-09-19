import express from 'express';
import { WeatherService } from '../services/WeatherService.js';
import { validateCity } from '../middleware/validators.js';

const router = express.Router();
const weatherService = new WeatherService();

// Get current weather for a city
router.get('/:city', validateCity, async (req, res, next) => {
  try {
    const { city } = req.params;
    const weather = await weatherService.getCurrentWeather(city);
    
    res.json({
      success: true,
      data: weather,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get weather forecast for a city
router.get('/:city/forecast', validateCity, async (req, res, next) => {
  try {
    const { city } = req.params;
    const { days = 5 } = req.query;
    
    const forecast = await weatherService.getForecast(city, parseInt(days));
    
    res.json({
      success: true,
      data: forecast,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export { router as weatherRouter };
