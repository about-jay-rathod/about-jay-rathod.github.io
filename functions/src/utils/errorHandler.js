/**
 * Error Handling Utilities
 *
 * Provides comprehensive error handling, logging, and response utilities
 * for Firebase Functions with proper error categorization and user-friendly messages.
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

/**
 * Error categories for better error handling
 */
const ErrorCategories = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  API_ERROR: 'API_ERROR',
  EMAIL_ERROR: 'EMAIL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
};

/**
 * HTTP Status codes for different error types
 */
const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(
    message,
    category = ErrorCategories.SYSTEM_ERROR,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.name = 'AppError';
    this.category = category;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Log error with proper formatting and context
 * @param {Error|AppError} error - Error to log
 * @param {string} context - Additional context information
 */
function logError(error, context = '') {
  const errorInfo = {
    message: error.message,
    category: error.category || 'UNKNOWN',
    statusCode: error.statusCode || 500,
    timestamp: error.timestamp || new Date().toISOString(),
    context: context,
    stack: error.stack,
  };

  console.error(`❌ [${errorInfo.category}] ${errorInfo.message}`, {
    ...errorInfo,
    stack: process.env.NODE_ENV === 'development' ? errorInfo.stack : undefined,
  });
}

/**
 * Log warning with context
 * @param {string} message - Warning message
 * @param {string} context - Additional context
 */
function logWarning(message, context = '') {
  console.warn(`⚠️  ${message}`, { context, timestamp: new Date().toISOString() });
}

/**
 * Log info message
 * @param {string} message - Info message
 * @param {Object} data - Additional data to log
 */
function logInfo(message, data = {}) {
  console.log(`ℹ️  ${message}`, { ...data, timestamp: new Date().toISOString() });
}

/**
 * Get user-friendly error message
 * @param {Error|AppError} error - Error object
 * @returns {string} - User-friendly error message
 */
function getUserFriendlyMessage(error) {
  if (error instanceof AppError) {
    switch (error.category) {
      case ErrorCategories.VALIDATION_ERROR:
        return 'Please check your input and try again.';
      case ErrorCategories.EMAIL_ERROR:
        return 'There was an issue sending the email. Please try again or contact us directly.';
      case ErrorCategories.API_ERROR:
        return 'Our AI assistant is temporarily unavailable. Your message has been received.';
      case ErrorCategories.NETWORK_ERROR:
        return 'Network connection issue. Please check your connection and try again.';
      case ErrorCategories.RATE_LIMIT_ERROR:
        return 'Too many requests. Please wait a moment before trying again.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  }

  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Create standardized error response
 * @param {Error|AppError} error - Error object
 * @param {string} context - Additional context
 * @returns {Object} - Standardized error response
 */
function createErrorResponse(error, context = '') {
  logError(error, context);

  const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const category = error.category || ErrorCategories.SYSTEM_ERROR;

  return {
    success: false,
    error: {
      message: getUserFriendlyMessage(error),
      category: category,
      timestamp: new Date().toISOString(),
      // Only include technical details in development
      ...(process.env.NODE_ENV === 'development' && {
        technical: {
          originalMessage: error.message,
          stack: error.stack,
        },
      }),
    },
    statusCode: statusCode,
  };
}

/**
 * Create success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @returns {Object} - Standardized success response
 */
function createSuccessResponse(data = {}, message = 'Operation completed successfully') {
  return {
    success: true,
    message: message,
    data: data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle async operations with error catching
 * @param {Function} asyncFunction - Async function to execute
 * @returns {Function} - Wrapped function with error handling
 */
function asyncHandler(asyncFunction) {
  return async (req, res, next) => {
    try {
      await asyncFunction(req, res, next);
    } catch (error) {
      const errorResponse = createErrorResponse(error, `${req.method} ${req.url}`);
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  };
}

/**
 * Validate environment variables and throw appropriate errors
 * @param {string[]} requiredVars - Array of required environment variable names
 * @throws {AppError} - If required variables are missing
 */
function validateEnvironmentVariables(requiredVars) {
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new AppError(
      `Missing required environment variables: ${missingVars.join(', ')}`,
      ErrorCategories.SYSTEM_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Create specific error types for common scenarios
 */
const ErrorFactory = {
  /**
   * Create validation error
   * @param {string} message - Error message
   * @returns {AppError} - Validation error
   */
  validationError(message) {
    return new AppError(message, ErrorCategories.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
  },

  /**
   * Create email error
   * @param {string} message - Error message
   * @returns {AppError} - Email error
   */
  emailError(message) {
    return new AppError(message, ErrorCategories.EMAIL_ERROR, HttpStatus.BAD_GATEWAY);
  },

  /**
   * Create API error
   * @param {string} message - Error message
   * @returns {AppError} - API error
   */
  apiError(message) {
    return new AppError(message, ErrorCategories.API_ERROR, HttpStatus.BAD_GATEWAY);
  },

  /**
   * Create rate limit error
   * @param {string} message - Error message
   * @returns {AppError} - Rate limit error
   */
  rateLimitError(message = 'Rate limit exceeded') {
    return new AppError(message, ErrorCategories.RATE_LIMIT_ERROR, HttpStatus.RATE_LIMITED);
  },

  /**
   * Create network error
   * @param {string} message - Error message
   * @returns {AppError} - Network error
   */
  networkError(message) {
    return new AppError(message, ErrorCategories.NETWORK_ERROR, HttpStatus.BAD_GATEWAY);
  },
};

module.exports = {
  AppError,
  ErrorCategories,
  HttpStatus,
  ErrorFactory,
  logError,
  logWarning,
  logInfo,
  getUserFriendlyMessage,
  createErrorResponse,
  createSuccessResponse,
  asyncHandler,
  validateEnvironmentVariables,
};
