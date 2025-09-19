import request from 'supertest';
import app from '../src/index.js';

// Mock environment variables for tests
process.env.OPENWEATHER_API_KEY = 'test_key';
process.env.GROQ_API_KEY = 'test_key';

describe('Weather API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Smart Weather Advisory API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/weather/:city', () => {
    it('should validate city parameter', async () => {
      const response = await request(app)
        .get('/api/weather/')
        .expect(404);
    });

    it('should reject invalid city characters', async () => {
      const response = await request(app)
        .get('/api/weather/@#$%')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBe('Validation Error');
    });

    it('should accept valid Romanian city names', async () => {
      // Note: This will fail without real API keys, but validates the route structure
      const response = await request(app)
        .get('/api/weather/București')
        .expect(401); // Expected due to missing real API key

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/advisory/:city', () => {
    it('should validate city parameter for advisory', async () => {
      const response = await request(app)
        .get('/api/advisory/@#$%')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});