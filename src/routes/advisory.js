import express from 'express';
import { AdvisoryService } from '../services/AdvisoryService.js';
import { validateCity } from '../middleware/validators.js';

const router = express.Router();
const advisoryService = new AdvisoryService();

// Get AI-powered weather advisory
router.get('/:city', validateCity, async (req, res, next) => {
  try {
    const { city } = req.params;
    const { activity, preferences } = req.query;
    
    const advisory = await advisoryService.getWeatherAdvisory(city, {
      activity,
      preferences
    });
    
    res.json({
      success: true,
      data: advisory,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get personalized recommendations
router.post('/:city/recommendations', validateCity, async (req, res, next) => {
  try {
    const { city } = req.params;
    const { userProfile, plannedActivities } = req.body;
    
    const recommendations = await advisoryService.getPersonalizedRecommendations(
      city, 
      userProfile, 
      plannedActivities
    );
    
    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export { router as advisoryRouter };
