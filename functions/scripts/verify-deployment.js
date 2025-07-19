#!/usr/bin/env node

/**
 * Production Deployment Verification Script
 *
 * Verifies that the project is ready for production deployment
 * by running comprehensive checks on code quality, security,
 * and configuration.
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Production Deployment Verification\n');

let hasErrors = false;

/**
 * Run a command and capture output
 */
function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    const output = execSync(command, { stdio: 'pipe' }).toString();
    console.log(`✅ ${description} - PASSED\n`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    console.log(`   Error: ${error.message}\n`);
    hasErrors = true;
    return { success: false, error: error.message };
  }
}

/**
 * Check if file exists
 */
function checkFile(filePath, description) {
  try {
    console.log(`📄 ${description}...`);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${description} - EXISTS\n`);
      return true;
    } else {
      console.log(`❌ ${description} - MISSING\n`);
      hasErrors = true;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - ERROR: ${error.message}\n`);
    hasErrors = true;
    return false;
  }
}

// 1. Environment Configuration
checkFile('.env', 'Environment variables file');

// 2. Code Quality
runCommand('npx eslint src/ test/ scripts/ --fix', 'Code linting');
runCommand('npm run format', 'Code formatting');

// 3. Testing
runCommand('node test/unit.test.js', 'Unit tests');

// 4. Security
runCommand('npm audit', 'Security vulnerability check');

// 5. Environment Validation
runCommand('npm run validate-env', 'Environment validation');

// 6. Build Process
runCommand('npx eslint src/ test/ scripts/ && npm run validate-env', 'Build validation');

// 7. Documentation
checkFile('../README.md', 'Main README');
checkFile('README.md', 'Functions README');
checkFile('docs/README.md', 'API Documentation');
checkFile('../Documentation/DEPENDENCIES.md', 'Dependencies documentation');

// 8. Configuration Files
checkFile('.eslintrc.js', 'ESLint configuration');
checkFile('.prettierrc', 'Prettier configuration');
checkFile('package.json', 'Functions package configuration');
checkFile('../package.json', 'Root package configuration');

// Final Results
console.log('='.repeat(60));
console.log('🎯 DEPLOYMENT VERIFICATION RESULTS');
console.log('='.repeat(60));

if (hasErrors) {
  console.log('❌ VERIFICATION FAILED');
  console.log('   Please fix the issues above before deploying to production.');
  console.log('   Run this script again after making corrections.\n');
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED');
  console.log('🚀 Project is READY for production deployment!');
  console.log('   You can safely run deployment scripts or firebase deploy.\n');

  console.log('📋 Deployment Commands:');
  console.log('   npm run deploy          # Full deployment');
  console.log('   npm run deploy:functions # Functions only');
  console.log('   npm run deploy:hosting   # Hosting only');
  console.log('');
  console.log('🔍 Monitoring Commands:');
  console.log('   npm run logs            # View function logs');
  console.log('   firebase functions:log  # Detailed function logs');
  console.log('');

  process.exit(0);
}
