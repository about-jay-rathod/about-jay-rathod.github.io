/**
 * CORS Middleware
 *
 * Handles Cross-Origin Resource Sharing (CORS) configuration
 * for Firebase Functions with security best practices.
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

/**
 * Allowed origins for CORS
 * In production, replace '*' with specific domains
 */
const ALLOWED_ORIGINS = [
  'https://about-jay-rathod.web.app',
  'https://about-jay-rathod.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
];

/**
 * CORS configuration options
 */
const CORS_CONFIG = {
  origin: process.env.NODE_ENV === 'development' ? '*' : ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: false,
  maxAge: 86400, // 24 hours
};

/**
 * Set CORS headers on response
 * @param {Object} res - Express response object
 * @param {string} origin - Request origin
 */
function setCorsHeaders(res, origin = '*') {
  // Determine allowed origin
  const allowedOrigin =
    process.env.NODE_ENV === 'development'
      ? '*'
      : ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0];

  res.set({
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': CORS_CONFIG.methods.join(', '),
    'Access-Control-Allow-Headers': CORS_CONFIG.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': CORS_CONFIG.credentials.toString(),
    'Access-Control-Max-Age': CORS_CONFIG.maxAge.toString(),
  });
}

/**
 * CORS middleware for Firebase Functions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function corsMiddleware(req, res, next) {
  const origin = req.get('Origin');

  // Set CORS headers
  setCorsHeaders(res, origin);

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Log CORS request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 CORS: ${req.method} ${req.url} from ${origin || 'unknown'}`);
  }

  // Continue to next middleware
  if (next) {
    next();
  }
}

/**
 * Simple CORS handler for individual functions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} - Whether request should continue
 */
function handleCors(req, res) {
  const origin = req.get('Origin');
  setCorsHeaders(res, origin);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return false;
  }

  return true;
}

/**
 * Validate origin for security
 * @param {string} origin - Request origin
 * @returns {boolean} - Whether origin is allowed
 */
function isOriginAllowed(origin) {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Security headers middleware
 * @param {Object} res - Express response object
 */
function setSecurityHeaders(res) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  });
}

/**
 * Complete security and CORS setup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} - Whether request should continue
 */
function setupSecurity(req, res) {
  // Set security headers
  setSecurityHeaders(res);

  // Handle CORS
  return handleCors(req, res);
}

module.exports = {
  corsMiddleware,
  handleCors,
  setCorsHeaders,
  setSecurityHeaders,
  setupSecurity,
  isOriginAllowed,
  CORS_CONFIG,
  ALLOWED_ORIGINS,
};
