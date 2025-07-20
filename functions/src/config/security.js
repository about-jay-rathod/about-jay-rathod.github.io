/**
 * Security Configuration - PRODUCTION READY
 * 
 * This file contains secure configuration for the portfolio app.
 * All sensitive data is handled through environment variables.
 * 
 * @author Jay Rathod
 * @version 2.1.0
 */

// Environment configuration
const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';

/**
 * Allowed origins for CORS - STRICT SECURITY
 */
const ALLOWED_ORIGINS = IS_PRODUCTION ? [
  'https://about-jay-rathod.web.app',
  'https://about-jay-rathod.firebaseapp.com',
  'https://about-jay-rathod.github.io', // GitHub Pages backup
] : [
  'https://about-jay-rathod.web.app',
  'https://about-jay-rathod.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5173',
];

/**
 * Rate limiting configuration
 */
const RATE_LIMITS = {
  CHATBOT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // Max 10 requests per 15 minutes per IP
    message: 'Too many chatbot requests. Please wait before asking another question.',
  },
  CONTACT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // Max 3 contact submissions per hour per IP
    message: 'Contact form rate limit exceeded. Please wait before submitting again.',
  },
  GLOBAL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // Max 30 requests per minute per IP
    message: 'Too many requests. Please slow down.',
  }
};

/**
 * Security headers configuration
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Powered-By': 'Jay-Rathod-Portfolio', // Custom header to hide technology
  'Content-Security-Policy': IS_PRODUCTION 
    ? "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com;"
    : "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: http: ws: wss:;",
  'Strict-Transport-Security': IS_PRODUCTION ? 'max-age=31536000; includeSubDomains' : '',
};

/**
 * API endpoint configuration (never expose actual URLs)
 */
const API_CONFIG = {
  // These are placeholder endpoints - actual URLs are set via environment variables
  CHATBOT_ENDPOINT: process.env.CHATBOT_FUNCTION_URL || '/api/chatbot',
  CONTACT_ENDPOINT: process.env.CONTACT_FUNCTION_URL || '/api/contact',
  
  // Timeout configurations
  TIMEOUT: {
    CHATBOT: 30000, // 30 seconds
    CONTACT: 15000, // 15 seconds
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 2,
    DELAY: 1000, // 1 second
  }
};

/**
 * Input validation limits
 */
const VALIDATION_LIMITS = {
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000, // Reduced from 5000 for security
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50, // Reduced from 100
  },
  EMAIL: {
    MAX_LENGTH: 100, // Reduced from 254
  },
  SUBJECT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100, // Reduced from 200
  },
  CONTACT_MESSAGE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000, // Reduced from 5000
  }
};

/**
 * Blocked patterns for security
 */
const SECURITY_PATTERNS = {
  SUSPICIOUS_WORDS: [
    'script', 'javascript', 'vbscript', 'onload', 'onerror', 'onclick',
    'eval', 'expression', 'url(', 'import', 'require', '@import',
    'document.', 'window.', 'location.', 'alert(', 'confirm(',
  ],
  SPAM_INDICATORS: [
    'viagra', 'cialis', 'lottery', 'winner', 'congratulations',
    'urgent', 'act now', 'limited time', 'click here', 'free money',
    'nigerian prince', 'inheritance', 'bank transfer',
  ],
  HTML_TAGS: /<[^>]*>/g,
  SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  SQL_INJECTION: /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
};

module.exports = {
  ENV,
  IS_PRODUCTION,
  ALLOWED_ORIGINS,
  RATE_LIMITS,
  SECURITY_HEADERS,
  API_CONFIG,
  VALIDATION_LIMITS,
  SECURITY_PATTERNS,
};
