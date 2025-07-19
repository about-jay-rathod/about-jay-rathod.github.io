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
require('dotenv').config();

// Import Services
const EmailService = require('./services/EmailService');
const AIService = require('./services/AIService');

// Import Utilities
const { validateContactForm, validateChatbotMessage } = require('./utils/validation');
const {
  createErrorResponse,
  createSuccessResponse,
  logError,
  logInfo,
  ErrorFactory,
  validateEnvironmentVariables,
} = require('./utils/errorHandler');
const { setupSecurity } = require('./utils/cors');

// Initialize Services
let emailService;
let aiService;

/**
 * Initialize services and validate environment
 */
function initializeServices() {
  try {
    // Validate required environment variables
    validateEnvironmentVariables(['GEMINI_API_KEY', 'EMAIL_USER', 'EMAIL_PASS']);

    // Initialize services
    emailService = new EmailService();
    aiService = new AIService();

    logInfo('🚀 Services initialized successfully');
  } catch (error) {
    logError(error, 'Service initialization');
    throw error;
  }
}

/**
 * AI Chatbot Function
 *
 * Handles chatbot conversations with AI-powered responses using
 * Google Gemini 2.0 Flash. Includes professional data context
 * and comprehensive error handling.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.chatbot = functions.https.onRequest(async (req, res) => {
  try {
    // Initialize services if not already done
    if (!aiService) {
      initializeServices();
    }

    // Setup security and CORS
    if (!setupSecurity(req, res)) {
      return; // OPTIONS request handled
    }

    // Validate request method
    if (req.method !== 'POST') {
      const error = ErrorFactory.validationError('Only POST method is allowed');
      const errorResponse = createErrorResponse(error, 'Invalid HTTP method');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    logInfo('🤖 Chatbot request received', {
      method: req.method,
      origin: req.get('Origin'),
    });

    // Validate and sanitize input
    const { message } = req.body;
    const validation = validateChatbotMessage(message);

    if (!validation.isValid) {
      const error = ErrorFactory.validationError(
        validation.errors.map((e) => e.message).join(', ')
      );
      const errorResponse = createErrorResponse(error, 'Message validation failed');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    // Generate AI response
    const aiResponse = await aiService.generateChatbotResponse(validation.sanitizedMessage);

    // Return success response
    const successResponse = createSuccessResponse(
      { response: aiResponse },
      'Chatbot response generated successfully'
    );

    logInfo('✅ Chatbot response sent successfully');
    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse = createErrorResponse(error, 'Chatbot function');
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});

/**
 * Contact Email Function
 *
 * Handles contact form submissions with a dual email system:
 * 1. Sends notification to Jay with contact details
 * 2. Sends AI-powered auto-reply to the user
 *
 * Features:
 * - Input validation and sanitization
 * - Professional HTML email templates
 * - AI-generated personalized responses
 * - Comprehensive error handling
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
  try {
    // Initialize services if not already done
    if (!emailService || !aiService) {
      initializeServices();
    }

    // Setup security and CORS
    if (!setupSecurity(req, res)) {
      return; // OPTIONS request handled
    }

    // Validate request method
    if (req.method !== 'POST') {
      const error = ErrorFactory.validationError('Only POST method is allowed');
      const errorResponse = createErrorResponse(error, 'Invalid HTTP method');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    logInfo('📧 Contact email request received', {
      method: req.method,
      origin: req.get('Origin'),
    });

    // Validate and sanitize contact form data
    const validation = validateContactForm(req.body);

    if (!validation.isValid) {
      const error = ErrorFactory.validationError(
        validation.errors.map((e) => e.message).join(', ')
      );
      const errorResponse = createErrorResponse(error, 'Contact form validation failed');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const contactData = validation.data;

    logInfo('📝 Processing contact form', {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
    });

    // Verify email configuration
    const emailConfigValid = await emailService.verifyConfiguration();
    if (!emailConfigValid) {
      throw ErrorFactory.emailError('Email service configuration invalid');
    }

    // Send notification email to Jay
    logInfo('📤 Sending notification email to Jay...');
    const notificationResult = await emailService.sendNotificationEmail(contactData);

    // Generate AI-powered auto-reply
    logInfo('🤖 Generating AI auto-reply...');
    const aiAutoReply = await aiService.generateEmailResponse(contactData);

    // Send auto-reply email to user
    logInfo('📤 Sending auto-reply email to user...');
    const autoReplyResult = await emailService.sendAutoReplyEmail(contactData, aiAutoReply);

    // Log successful completion
    logInfo('✅ Contact email process completed successfully', {
      notificationId: notificationResult.messageId,
      autoReplyId: autoReplyResult.messageId,
      recipient: contactData.email,
    });

    // Return success response (no AI text in frontend)
    const successResponse = createSuccessResponse(
      {
        message: "Thank you for your message! I'll get back to you soon.",
        sent: true,
        timestamp: new Date().toISOString(),
      },
      'Contact form submitted successfully'
    );

    res.status(200).json(successResponse);
  } catch (error) {
    // Handle specific error types
    if (error.code === 'EAUTH' || error.code === 'ENOTFOUND') {
      const emailError = ErrorFactory.emailError('Email service temporarily unavailable');
      const errorResponse = createErrorResponse(emailError, 'Contact email function');
      return res.status(errorResponse.statusCode).json(errorResponse);
    } else if (error.message && error.message.includes('Gemini')) {
      const apiError = ErrorFactory.apiError('AI service temporarily unavailable');
      const errorResponse = createErrorResponse(apiError, 'Contact email function');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const errorResponse = createErrorResponse(error, 'Contact email function');
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});

// Initialize services on startup
logInfo('🚀 Firebase Functions starting up...');
try {
  initializeServices();
  logInfo('✅ Firebase Functions ready');
} catch (error) {
  logError(error, 'Startup initialization');
  // Functions will still deploy but may not work properly
}
