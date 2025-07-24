/**
 * Jay Rathod Portfolio - Firebase Functions (Production Version)
 *
 * This is the main entry point for Firebase Functions with a modular,
 * production-ready architecture. The code is organized into services,
 * utilities, and proper error handling for maintainability and scalability.
 *
 * Architecture:
 * - Modular service-based architecture
 * - Comprehensive error handling and logging
 * - Input validation and sanitization
 * - Security best practices with CORS
 * - Professional email templates
 * - AI integration with fallbacks
 *
 * Functions:
 * 1. chatbot - AI-powered chatbot using Google Gemini 2.0 Flash
 * 2. sendContactEmail - Contact form handler with dual email system
 *
 * @author Jay Rathod <jayrathod.ca@gmail.com>
 * @version 2.1.0
 * @license MIT
 * @created July 19, 2025
 * @updated July 19, 2025
 */

// Core Dependencies
const functions = require('firebase-functions');
const path = require('path');
const fs = require('fs');

// For local development, read from .env file
if (!process.env.FUNCTIONS_EMULATOR) {
  // Production - use Firebase config
  const config = functions.config();
  
  // Set environment variables from Firebase config
  process.env.CHATBOT_ENABLED = config.chatbot?.enabled || 'disabled';
  process.env.MESSAGING_ENABLED = config.messaging?.enabled || 'disabled';
  process.env.GEMINI_API_KEY = config.gemini?.key || '';
  process.env.EMAIL_USER = config.gmail?.email || '';
  process.env.EMAIL_PASS = config.gmail?.app_password || '';
  process.env.EMAIL_TO = config.gmail?.email || '';
  process.env.NODE_ENV = 'production';
} else {
  // Local development - read environment variables from .env file
  try {
    // Read .env file from root directory
    const envPath = path.join(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            process.env[key.trim()] = value.trim();
          }
        }
      });
    } else {
      // Fallback values
      process.env.CHATBOT_ENABLED = 'enabled';  
      process.env.MESSAGING_ENABLED = 'enabled';  
      process.env.GEMINI_API_KEY = 'AIzaSyCi50PaYksNaInX-M9WSAO9wm6xygEbMhI';
      process.env.EMAIL_USER = 'jayrathod.ca@gmail.com';
      process.env.EMAIL_PASS = 'zutr lcot hcst gdpt';
      process.env.EMAIL_TO = 'jayrathod.ca@gmail.com';
      process.env.NODE_ENV = 'development';
    }
  } catch (error) {
    // Fallback values
    process.env.CHATBOT_ENABLED = 'enabled';  
    process.env.MESSAGING_ENABLED = 'enabled';  
    process.env.GEMINI_API_KEY = 'AIzaSyCi50PaYksNaInX-M9WSAO9wm6xygEbMhI';
    process.env.EMAIL_USER = 'jayrathod.ca@gmail.com';
    process.env.EMAIL_PASS = 'zutr lcot hcst gdpt';
    process.env.EMAIL_TO = 'jayrathod.ca@gmail.com';
    process.env.NODE_ENV = 'development';
  }
}

// Feature Toggle Configuration - read from environment variables
const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED === 'enabled';
const MESSAGING_ENABLED = process.env.MESSAGING_ENABLED === 'enabled';

// Import Security & Utilities (always needed)
const { validateContactForm, validateChatbotMessage } = require('./utils/validation');
const {
  createErrorResponse,
  createSuccessResponse,
  logError,
  logInfo,
  ErrorFactory,
  validateEnvironmentVariables,
} = require('./utils/errorHandler');
const { createSecurityMiddleware } = require('./middleware/security');
const { VALIDATION_LIMITS } = require('./config/security');

// Initialize Services
let emailService;
let aiService;

/**
 * Initialize services and validate environment (lazy loading)
 */
function initializeServices() {
  try {
    // Only import and initialize services when actually needed
    if (!emailService) {
      const EmailService = require('./services/EmailService');
      emailService = new EmailService();
    }
    if (!aiService) {
      const AIService = require('./services/AIService');
      aiService = new AIService();
    }

    logInfo('🚀 Services initialized successfully');
  } catch (error) {
    logError(error, 'Service initialization');
    throw error;
  }
}

/**
 * AI Chatbot Function - SECURED
 *
 * Handles chatbot conversations with comprehensive security:
 * - Rate limiting (10 requests per 15 minutes per IP)
 * - Input validation and sanitization
 * - Origin verification  
 * - Request logging
 * - Abuse detection
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
if (CHATBOT_ENABLED) {
  exports.chatbot = functions.https.onRequest(async (req, res) => {
    // Apply security middleware
    const securityMiddleware = createSecurityMiddleware({
      limitType: 'CHATBOT',
      requiredFields: ['message'],
      maxSizes: { message: VALIDATION_LIMITS.MESSAGE.MAX_LENGTH },
      enableOriginValidation: true,
    });

    // Execute middleware stack
    let currentIndex = 0;
    const executeMiddleware = async () => {
    if (currentIndex >= securityMiddleware.length) {
      return handleChatbotRequest(req, res);
    }

    const middleware = securityMiddleware[currentIndex++];
    
    return new Promise((resolve, reject) => {
      middleware(req, res, (error) => {
        if (error) {
          reject(error);
        } else if (res.headersSent) {
          resolve(); // Response already sent by middleware
        } else {
          executeMiddleware().then(resolve).catch(reject);
        }
      });
    });
  };

  try {
    await executeMiddleware();
  } catch (error) {
    if (!res.headersSent) {
      const errorResponse = createErrorResponse(error, 'Chatbot security check');
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }
});

async function handleChatbotRequest(req, res) {
  try {
    // Initialize services if needed
    if (!aiService) {
      initializeServices();
    }

    logInfo('🤖 Secured chatbot request processed', {
      ip: req.get('x-forwarded-for')?.split(',')[0] || req.ip,
      origin: req.get('Origin'),
    });

    // Additional message validation
    const { message } = req.body;
    const validation = validateChatbotMessage(message);

    if (!validation.isValid) {
      const error = ErrorFactory.validationError(
        validation.errors.map((e) => e.message).join(', ')
      );
      const errorResponse = createErrorResponse(error, 'Message validation failed');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    // Generate AI response with timeout
    const aiResponse = await Promise.race([
      aiService.generateChatbotResponse(validation.sanitizedMessage),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Response timeout')), 25000)
      )
    ]);

    // Return success response
    const successResponse = createSuccessResponse(
      { response: aiResponse },
      'Response generated successfully'
    );

    logInfo('✅ Secured chatbot response sent');
    res.status(200).json(successResponse);

  } catch (error) {
    logError(error, 'Secured chatbot handler');
    const errorResponse = createErrorResponse(
      ErrorFactory.apiError('Unable to process request at this time'), 
      'Chatbot function'
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

} // End of CHATBOT_ENABLED conditional export

/**
 * Contact Email Function - SECURED
 *
 * Handles contact form submissions with enhanced security:
 * - Rate limiting (3 submissions per hour per IP)
 * - Input validation and sanitization
 * - Origin verification
 * - Spam detection
 * - Request logging
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
if (MESSAGING_ENABLED) {
  exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
    // Apply security middleware
    const securityMiddleware = createSecurityMiddleware({
      limitType: 'CONTACT',
      requiredFields: ['name', 'email', 'subject', 'message'],
      maxSizes: {
        name: VALIDATION_LIMITS.NAME.MAX_LENGTH,
        email: VALIDATION_LIMITS.EMAIL.MAX_LENGTH,
        subject: VALIDATION_LIMITS.SUBJECT.MAX_LENGTH,
      message: VALIDATION_LIMITS.CONTACT_MESSAGE.MAX_LENGTH,
    },
    enableOriginValidation: true,
  });

  // Execute middleware stack
  let currentIndex = 0;
  const executeMiddleware = async () => {
    if (currentIndex >= securityMiddleware.length) {
      return handleContactRequest(req, res);
    }

    const middleware = securityMiddleware[currentIndex++];
    
    return new Promise((resolve, reject) => {
      middleware(req, res, (error) => {
        if (error) {
          reject(error);
        } else if (res.headersSent) {
          resolve(); // Response already sent by middleware
        } else {
          executeMiddleware().then(resolve).catch(reject);
        }
      });
    });
  };

  try {
    await executeMiddleware();
  } catch (error) {
    if (!res.headersSent) {
      const errorResponse = createErrorResponse(error, 'Contact security check');
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }
});

} // End of MESSAGING_ENABLED conditional export

async function handleContactRequest(req, res) {
  try {
    // Initialize services if needed
    if (!emailService || !aiService) {
      initializeServices();
    }

    logInfo('📧 Secured contact request processed', {
      ip: req.get('x-forwarded-for')?.split(',')[0] || req.ip,
      origin: req.get('Origin'),
    });

    // Additional contact form validation
    const validation = validateContactForm(req.body);

    if (!validation.isValid) {
      const error = ErrorFactory.validationError(
        validation.errors.map((e) => e.message).join(', ')
      );
      const errorResponse = createErrorResponse(error, 'Contact form validation failed');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const contactData = validation.data;

    // Verify email service
    const emailConfigValid = await emailService.verifyConfiguration();
    if (!emailConfigValid) {
      throw ErrorFactory.emailError('Email service temporarily unavailable');
    }

    // Process with timeout
    await Promise.race([
      processContactSubmission(contactData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Processing timeout')), 30000)
      )
    ]);

    // Return success response
    const successResponse = createSuccessResponse(
      {
        message: "Thank you for your message! I'll get back to you soon.",
        sent: true,
        timestamp: new Date().toISOString(),
      },
      'Contact form submitted successfully'
    );

    logInfo('✅ Secured contact form processed successfully');
    res.status(200).json(successResponse);

  } catch (error) {
    logError(error, 'Secured contact handler');
    
    let errorMessage = 'Unable to process your message at this time. Please try again later.';
    if (error.code === 'EAUTH' || error.code === 'ENOTFOUND') {
      errorMessage = 'Email service temporarily unavailable. Please try again in a few minutes.';
    }

    const errorResponse = createErrorResponse(
      ErrorFactory.emailError(errorMessage),
      'Contact function'
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

async function processContactSubmission(contactData) {
  // Send notification email
  logInfo('📤 Sending notification email...');
  const notificationResult = await emailService.sendNotificationEmail(contactData);

  // Generate and send auto-reply
  logInfo('🤖 Generating auto-reply...');
  const aiAutoReply = await aiService.generateEmailResponse(contactData);
  
  logInfo('📤 Sending auto-reply...');
  const autoReplyResult = await emailService.sendAutoReplyEmail(contactData, aiAutoReply);

  logInfo('✅ Contact processing completed', {
    notificationId: notificationResult.messageId,
    autoReplyId: autoReplyResult.messageId,
  });
}

/**
 * Configuration Endpoint
 * Serves frontend configuration based on environment variables
 * This function doesn't require API keys, so we don't validate them
 */
exports.config = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Content-Type', 'application/javascript');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  try {
    // Generate configuration based on environment variables
    const config = {
      chatbotEnabled: CHATBOT_ENABLED,
      messagingEnabled: MESSAGING_ENABLED,
      apiEndpoints: {
        chatbot: '/api/chatbot',
        contact: '/api/sendContactEmail'
      }
    };

    // Return as JavaScript that sets a global variable
    const configScript = `
window.portfolioConfig = ${JSON.stringify(config, null, 2)};
console.log('Portfolio configuration loaded:', window.portfolioConfig);
    `;

    res.status(200).send(configScript);
  } catch (error) {
    console.error('Config endpoint error:', error);
    // Return a default config if there's an error
    const defaultConfigScript = `
window.portfolioConfig = {
  chatbotEnabled: false,
  messagingEnabled: false,
  apiEndpoints: { chatbot: '/api/chatbot', contact: '/api/sendContactEmail' }
};
console.log('Default configuration loaded due to error');
    `;
    res.status(200).send(defaultConfigScript);
  }
});

// Services will be initialized on first use, not at startup
logInfo('🚀 Firebase Functions ready for requests');
