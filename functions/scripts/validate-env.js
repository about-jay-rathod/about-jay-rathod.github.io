/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are present
 * and properly configured before deployment or execution.
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Required environment variables for the application
 */
const REQUIRED_ENV_VARS = [
  'GEMINI_API_KEY',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_SERVICE',
  'EMAIL_HOST',
  'EMAIL_PORT',
];

/**
 * Optional environment variables with their default values
 */
const OPTIONAL_ENV_VARS = {
  NODE_ENV: 'production',
  LOG_LEVEL: 'info',
};

/**
 * Validates a single environment variable
 * @param {string} varName - Name of the environment variable
 * @param {string|undefined} value - Value of the environment variable
 * @returns {boolean} - Whether the variable is valid
 */
function validateEnvVar(varName, value) {
  if (!value || value.trim() === '') {
    console.error(`❌ Missing required environment variable: ${varName}`);
    return false;
  }

  // Additional validation for specific variables
  switch (varName) {
    case 'EMAIL_PORT':
      if (isNaN(parseInt(value))) {
        console.error(`❌ EMAIL_PORT must be a number, got: ${value}`);
        return false;
      }
      break;
    case 'GEMINI_API_KEY':
      if (!value.startsWith('AIza')) {
        console.warn(`⚠️  GEMINI_API_KEY format may be incorrect`);
      }
      break;
    case 'EMAIL_USER':
      if (!value.includes('@')) {
        console.error(`❌ EMAIL_USER must be a valid email address, got: ${value}`);
        return false;
      }
      break;
  }

  console.log(`✅ ${varName}: configured`);
  return true;
}

/**
 * Main validation function
 */
function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found! Please create one using .env.template as reference.');
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config();

  let isValid = true;

  // Validate required variables
  console.log('📋 Required Variables:');
  for (const varName of REQUIRED_ENV_VARS) {
    if (!validateEnvVar(varName, process.env[varName])) {
      isValid = false;
    }
  }

  // Set optional variables
  console.log('\n📋 Optional Variables:');
  for (const [varName, defaultValue] of Object.entries(OPTIONAL_ENV_VARS)) {
    if (!process.env[varName]) {
      process.env[varName] = defaultValue;
      console.log(`✅ ${varName}: using default value (${defaultValue})`);
    } else {
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    }
  }

  if (!isValid) {
    console.error('\n❌ Environment validation failed! Please fix the issues above.');
    process.exit(1);
  }

  console.log('\n✅ All environment variables are valid!');
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnvironment();
}

module.exports = {
  validateEnvironment,
  REQUIRED_ENV_VARS,
  OPTIONAL_ENV_VARS,
};
