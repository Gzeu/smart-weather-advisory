import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
  },
  points: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Number of requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW) || 900, // Per 15 minutes
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    const error = new Error('Too Many Requests');
    error.statusCode = 429;
    error.retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 1;
    
    res.set('Retry-After', error.retryAfter);
    next(error);
  }
};

export { rateLimiterMiddleware as rateLimiter };
