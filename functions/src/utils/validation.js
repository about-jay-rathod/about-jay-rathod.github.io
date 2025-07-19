/**
 * Input Validation Utilities
 *
 * Provides comprehensive input validation and sanitization functions
 * for contact forms, email data, and user inputs.
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validation error types
 */
const ValidationErrors = {
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  TOO_LONG: 'TOO_LONG',
  TOO_SHORT: 'TOO_SHORT',
  INVALID_CHARACTERS: 'INVALID_CHARACTERS',
  SPAM_DETECTED: 'SPAM_DETECTED',
};

/**
 * Field length constraints
 */
const FieldLimits = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  SUBJECT_MIN: 5,
  SUBJECT_MAX: 200,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
  EMAIL_MAX: 254,
};

/**
 * Common spam patterns to detect
 */
const SPAM_PATTERNS = [
  /viagra|cialis|pharmacy/i,
  /make money fast|earn \$\d+/i,
  /click here|visit now/i,
  /congratulations.*won/i,
  /nigerian prince|inheritance/i,
  /urgent.*reply/i,
];

/**
 * Sanitize input by removing dangerous characters and trimming
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>"']/g, '') // Remove potential XSS characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  return EMAIL_REGEX.test(email.trim()) && email.length <= FieldLimits.EMAIL_MAX;
}

/**
 * Check if text contains spam patterns
 * @param {string} text - Text to check
 * @returns {boolean} - Whether spam is detected
 */
function isSpamContent(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return SPAM_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Validate individual field
 * @param {string} fieldName - Name of the field
 * @param {string} value - Field value
 * @param {Object} limits - Field limits object
 * @returns {Object} - Validation result
 */
function validateField(fieldName, value, limits) {
  const result = {
    isValid: true,
    errors: [],
    sanitizedValue: '',
  };

  // Check if value exists
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.REQUIRED_FIELD,
      message: `${fieldName} is required`,
    });
    return result;
  }

  // Sanitize value
  result.sanitizedValue = sanitizeInput(value);

  // Check length constraints
  if (limits.min && result.sanitizedValue.length < limits.min) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.TOO_SHORT,
      message: `${fieldName} must be at least ${limits.min} characters`,
    });
  }

  if (limits.max && result.sanitizedValue.length > limits.max) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.TOO_LONG,
      message: `${fieldName} must not exceed ${limits.max} characters`,
    });
  }

  // Check for spam content
  if (isSpamContent(result.sanitizedValue)) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.SPAM_DETECTED,
      message: `${fieldName} contains potentially inappropriate content`,
    });
  }

  return result;
}

/**
 * Validate contact form data
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Contact name
 * @param {string} formData.email - Contact email
 * @param {string} formData.subject - Email subject
 * @param {string} formData.message - Email message
 * @returns {Object} - Comprehensive validation result
 */
function validateContactForm(formData) {
  const result = {
    isValid: true,
    errors: [],
    data: {},
    summary: '',
  };

  try {
    // Validate name
    const nameValidation = validateField('Name', formData.name, {
      min: FieldLimits.NAME_MIN,
      max: FieldLimits.NAME_MAX,
    });

    if (!nameValidation.isValid) {
      result.isValid = false;
      result.errors.push(...nameValidation.errors);
    } else {
      result.data.name = nameValidation.sanitizedValue;
    }

    // Validate email
    const emailValue = formData.email?.trim();
    if (!emailValue) {
      result.isValid = false;
      result.errors.push({
        type: ValidationErrors.REQUIRED_FIELD,
        message: 'Email is required',
      });
    } else if (!isValidEmail(emailValue)) {
      result.isValid = false;
      result.errors.push({
        type: ValidationErrors.INVALID_EMAIL,
        message: 'Please provide a valid email address',
      });
    } else {
      result.data.email = emailValue.toLowerCase();
    }

    // Validate subject
    const subjectValidation = validateField('Subject', formData.subject, {
      min: FieldLimits.SUBJECT_MIN,
      max: FieldLimits.SUBJECT_MAX,
    });

    if (!subjectValidation.isValid) {
      result.isValid = false;
      result.errors.push(...subjectValidation.errors);
    } else {
      result.data.subject = subjectValidation.sanitizedValue;
    }

    // Validate message
    const messageValidation = validateField('Message', formData.message, {
      min: FieldLimits.MESSAGE_MIN,
      max: FieldLimits.MESSAGE_MAX,
    });

    if (!messageValidation.isValid) {
      result.isValid = false;
      result.errors.push(...messageValidation.errors);
    } else {
      result.data.message = messageValidation.sanitizedValue;
    }

    // Generate summary
    if (result.isValid) {
      result.summary = '✅ All fields are valid';
      console.log(`✅ Contact form validation passed for ${result.data.email}`);
    } else {
      result.summary = `❌ ${result.errors.length} validation error(s) found`;
      console.warn(
        `❌ Contact form validation failed: ${result.errors.map((e) => e.message).join(', ')}`
      );
    }
  } catch (error) {
    console.error('❌ Contact form validation error:', error);
    result.isValid = false;
    result.errors.push({
      type: 'VALIDATION_ERROR',
      message: 'An error occurred during validation',
    });
    result.summary = '❌ Validation failed due to system error';
  }

  return result;
}

/**
 * Validate chatbot message
 * @param {string} message - Chatbot message
 * @returns {Object} - Validation result
 */
function validateChatbotMessage(message) {
  const result = {
    isValid: true,
    errors: [],
    sanitizedMessage: '',
    summary: '',
  };

  // Check if message exists
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.REQUIRED_FIELD,
      message: 'Message cannot be empty',
    });
    result.summary = '❌ Empty message';
    return result;
  }

  // Sanitize message
  result.sanitizedMessage = sanitizeInput(message);

  // Check length
  if (result.sanitizedMessage.length > 1000) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.TOO_LONG,
      message: 'Message is too long (max 1000 characters)',
    });
  }

  // Check for spam
  if (isSpamContent(result.sanitizedMessage)) {
    result.isValid = false;
    result.errors.push({
      type: ValidationErrors.SPAM_DETECTED,
      message: 'Message contains inappropriate content',
    });
  }

  if (result.isValid) {
    result.summary = '✅ Message is valid';
  } else {
    result.summary = `❌ Message validation failed: ${result.errors.map((e) => e.message).join(', ')}`;
  }

  return result;
}

module.exports = {
  validateContactForm,
  validateChatbotMessage,
  validateField,
  sanitizeInput,
  isValidEmail,
  isSpamContent,
  ValidationErrors,
  FieldLimits,
};
