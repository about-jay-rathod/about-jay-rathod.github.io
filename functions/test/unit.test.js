/**
 * Unit Tests for Firebase Functions
 *
 * Tests individual components and utilities in isolation.
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

const { validateContactForm, validateChatbotMessage } = require('../src/utils/validation');
const { createSuccessResponse, createErrorResponse } = require('../src/utils/errorHandler');

/**
 * Simple test runner
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
    };
  }

  test(description, testFunction) {
    this.tests.push({ description, testFunction });
  }

  async run() {
    console.log('🧪 Running Unit Tests...\n');

    for (const { description, testFunction } of this.tests) {
      try {
        await testFunction();
        console.log(`✅ ${description}`);
        this.results.passed++;
      } catch (error) {
        console.log(`❌ ${description}`);
        console.log(`   Error: ${error.message}`);
        this.results.failed++;
      }
      this.results.total++;
    }

    console.log(`\n📊 Test Results: ${this.results.passed}/${this.results.total} passed`);

    if (this.results.failed > 0) {
      process.exit(1);
    }
  }
}

const runner = new TestRunner();

// Validation Tests
runner.test('Contact form validation - valid data', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message with enough content.',
  };

  const result = validateContactForm(validData);
  if (!result.isValid) {
    throw new Error('Valid data should pass validation');
  }
});

runner.test('Contact form validation - missing email', () => {
  const invalidData = {
    name: 'John Doe',
    email: '',
    subject: 'Test Subject',
    message: 'This is a test message.',
  };

  const result = validateContactForm(invalidData);
  if (result.isValid) {
    throw new Error('Missing email should fail validation');
  }
});

runner.test('Contact form validation - invalid email format', () => {
  const invalidData = {
    name: 'John Doe',
    email: 'invalid-email',
    subject: 'Test Subject',
    message: 'This is a test message.',
  };

  const result = validateContactForm(invalidData);
  if (result.isValid) {
    throw new Error('Invalid email format should fail validation');
  }
});

runner.test('Chatbot message validation - valid message', () => {
  const result = validateChatbotMessage('Hello, tell me about Jay');
  if (!result.isValid) {
    throw new Error('Valid message should pass validation');
  }
});

runner.test('Chatbot message validation - empty message', () => {
  const result = validateChatbotMessage('');
  if (result.isValid) {
    throw new Error('Empty message should fail validation');
  }
});

// Error Handler Tests
runner.test('Success response creation', () => {
  const response = createSuccessResponse({ test: 'data' }, 'Test successful');
  if (!response.success || response.data.test !== 'data') {
    throw new Error('Success response format incorrect');
  }
});

runner.test('Error response creation', () => {
  const error = new Error('Test error');
  const response = createErrorResponse(error, 'Test context');
  if (response.success !== false || !response.error) {
    throw new Error('Error response format incorrect');
  }
});

// Run tests
if (require.main === module) {
  runner.run();
}

module.exports = runner;
