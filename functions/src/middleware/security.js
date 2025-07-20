/**
 * Advanced Security Middleware
 * 
 * Comprehensive security system with:
 * - Rate limiting with IP tracking
 * - Request validation and sanitization  
 * - Origin verification
 * - Abuse detection
 * - Security logging
 * 
 * @author Jay Rathod
 * @version 2.1.0
 */

const { ALLOWED_ORIGINS, RATE_LIMITS, SECURITY_HEADERS, SECURITY_PATTERNS } = require('../config/security');

// In-memory stores (use Redis in production for scalability)
const rateLimitStore = new Map();
const suspiciousIPs = new Map();
const requestLog = new Map();

/**
 * Get real client IP address
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.connection?.socket?.remoteAddress ||
         req.ip ||
         'unknown';
}

/**
 * Enhanced origin validation
 */
function validateOrigin(req) {
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  const host = req.get('Host');
  
  // In development, allow all origins
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // Check origin
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`🚫 Invalid origin: ${origin}`);
    return false;
  }

  // Check referer as backup
  if (!origin && referer) {
    const refererOrigin = new URL(referer).origin;
    if (!ALLOWED_ORIGINS.includes(refererOrigin)) {
      console.warn(`🚫 Invalid referer: ${referer}`);
      return false;
    }
  }

  // If neither origin nor referer, reject
  if (!origin && !referer) {
    console.warn(`🚫 No origin or referer provided`);
    return false;
  }

  return true;
}

/**
 * Advanced input sanitization
 */
function sanitizeInput(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input
    .trim()
    .substring(0, maxLength) // Enforce length limit
    .replace(SECURITY_PATTERNS.HTML_TAGS, '') // Remove HTML tags
    .replace(SECURITY_PATTERNS.SCRIPT_TAGS, '') // Remove script tags
    .replace(/[<>'"&\\\/\(\){}[\]]/g, ''); // Remove dangerous characters

  // Check for suspicious patterns
  const lowerInput = sanitized.toLowerCase();
  const suspiciousWords = SECURITY_PATTERNS.SUSPICIOUS_WORDS.filter(word => 
    lowerInput.includes(word.toLowerCase())
  );
  
  if (suspiciousWords.length > 0) {
    console.warn(`🚨 Suspicious words detected: ${suspiciousWords.join(', ')}`);
    // Don't reject, just log and clean
    suspiciousWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      sanitized = sanitized.replace(regex, '[FILTERED]');
    });
  }

  return sanitized;
}

/**
 * Rate limiting with enhanced tracking
 */
function rateLimiter(limitType = 'GLOBAL') {
  const config = RATE_LIMITS[limitType];
  
  return (req, res, next) => {
    const ip = getClientIP(req);
    const key = `${limitType}:${ip}`;
    const now = Date.now();
    
    // Get existing rate limit data
    let limitData = rateLimitStore.get(key) || {
      count: 0,
      resetTime: now + config.windowMs,
      requests: []
    };

    // Reset if window expired
    if (now > limitData.resetTime) {
      limitData = {
        count: 0,
        resetTime: now + config.windowMs,
        requests: []
      };
    }

    // Add current request
    limitData.requests.push(now);
    limitData.count++;

    // Remove old requests outside window
    limitData.requests = limitData.requests.filter(time => 
      now - time <= config.windowMs
    );
    limitData.count = limitData.requests.length;

    rateLimitStore.set(key, limitData);

    // Check rate limit
    if (limitData.count > config.maxRequests) {
      // Track suspicious IP
      const suspiciousData = suspiciousIPs.get(ip) || { violations: 0, lastViolation: 0 };
      suspiciousData.violations++;
      suspiciousData.lastViolation = now;
      suspiciousIPs.set(ip, suspiciousData);

      console.warn(`🚫 Rate limit exceeded for IP ${ip}: ${limitData.count}/${config.maxRequests}`);
      
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: config.message,
        retryAfter: Math.ceil((limitData.resetTime - now) / 1000),
      });
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.maxRequests - limitData.count).toString(),
      'X-RateLimit-Reset': Math.ceil(limitData.resetTime / 1000).toString(),
    });

    next();
  };
}

/**
 * Request validation middleware
 */
function validateRequest(requiredFields = [], maxSizes = {}) {
  return (req, res, next) => {
    const errors = [];

    // Validate Content-Type
    if (!req.is('application/json')) {
      errors.push('Content-Type must be application/json');
    }

    // Validate required fields
    requiredFields.forEach(field => {
      if (!req.body || !req.body[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate and sanitize fields
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          const maxSize = maxSizes[key] || 1000;
          req.body[key] = sanitizeInput(req.body[key], maxSize);
        }
      });
    }

    if (errors.length > 0) {
      console.warn(`🚨 Request validation failed:`, errors);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid request data',
        details: process.env.NODE_ENV === 'development' ? errors : undefined,
      });
    }

    next();
  };
}

/**
 * Security headers middleware
 */
function setSecurityHeaders(req, res, next) {
  // Set security headers
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    if (value) { // Only set non-empty values
      res.set(header, value);
    }
  });

  // Dynamic CORS headers
  const origin = req.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }

  res.set({
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Access-Control-Max-Age': '3600',
  });

  next();
}

/**
 * Request logging middleware
 */
function securityLogger(req, res, next) {
  const ip = getClientIP(req);
  const userAgent = req.get('User-Agent') || 'unknown';
  const origin = req.get('Origin') || 'none';
  const timestamp = new Date().toISOString();

  console.log(`🔒 ${req.method} ${req.path} | IP: ${ip} | Origin: ${origin} | ${timestamp}`);

  // Track request patterns
  const logKey = ip;
  const logs = requestLog.get(logKey) || [];
  logs.push({ timestamp: Date.now(), path: req.path, userAgent });
  
  // Keep only last 100 requests per IP
  if (logs.length > 100) {
    logs.shift();
  }
  
  requestLog.set(logKey, logs);

  next();
}

/**
 * CORS preflight handler
 */
function handlePreflight(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  next();
}

/**
 * Complete security middleware stack
 */
function createSecurityMiddleware(config = {}) {
  const {
    limitType = 'GLOBAL',
    requiredFields = [],
    maxSizes = {},
    enableOriginValidation = true,
  } = config;

  return [
    securityLogger,
    setSecurityHeaders,
    handlePreflight,
    rateLimiter(limitType),
    ...(enableOriginValidation ? [(req, res, next) => {
      if (!validateOrigin(req)) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Access denied',
        });
      }
      next();
    }] : []),
    validateRequest(requiredFields, maxSizes),
  ];
}

/**
 * Cleanup old data periodically
 */
function cleanup() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  // Cleanup rate limit store
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  // Cleanup request logs
  for (const [ip, logs] of requestLog.entries()) {
    const filteredLogs = logs.filter(log => now - log.timestamp < maxAge);
    if (filteredLogs.length === 0) {
      requestLog.delete(ip);
    } else {
      requestLog.set(ip, filteredLogs);
    }
  }

  // Cleanup old suspicious IPs
  for (const [ip, data] of suspiciousIPs.entries()) {
    if (now - data.lastViolation > maxAge) {
      suspiciousIPs.delete(ip);
    }
  }

  console.log('🧹 Security data cleanup completed');
}

// Run cleanup every hour
setInterval(cleanup, 60 * 60 * 1000);

module.exports = {
  createSecurityMiddleware,
  rateLimiter,
  validateRequest,
  setSecurityHeaders,
  securityLogger,
  handlePreflight,
  validateOrigin,
  sanitizeInput,
  getClientIP,
  cleanup,
};
