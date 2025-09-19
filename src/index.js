import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { weatherRouter } from './routes/weather.js';
import { advisoryRouter } from './routes/advisory.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://yourdomain.com'] : 
    ['http://localhost:3000', 'http://127.0.0.1:3000']
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/weather', weatherRouter);
app.use('/api/advisory', advisoryRouter);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Weather Advisory API',
    version: '1.0.0',
    description: 'AI-Powered Weather Advisory with personalized recommendations',
    endpoints: {
      weather: '/api/weather/:city',
      advisory: '/api/advisory/:city',
      health: '/health'
    },
    documentation: 'https://github.com/Gzeu/smart-weather-advisory#readme'
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`\n🌤️  Smart Weather Advisory API`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}`);
});

export default app;
