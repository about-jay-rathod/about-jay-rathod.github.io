# Firebase Functions Documentation

## Overview

This directory contains the Firebase Functions for Jay Rathod's portfolio website, built with a production-ready, modular architecture.

## Architecture

### Directory Structure

```
functions/
├── src/                    # Source code (modular architecture)
│   ├── index.js           # Main functions implementation
│   ├── services/          # Business logic services
│   │   ├── AIService.js   # Google Gemini AI integration
│   │   └── EmailService.js # Email sending and templates
│   ├── utils/             # Utility modules
│   │   ├── cors.js        # CORS and security headers
│   │   ├── errorHandler.js # Error handling and logging
│   │   └── validation.js  # Input validation and sanitization
│   └── templates/         # Email and response templates
├── test/                  # Test files
│   ├── unit.test.js       # Unit tests
│   └── integration.test.js # Integration tests
├── scripts/               # Utility scripts
│   └── validate-env.js    # Environment validation
├── docs/                  # Documentation
│   └── README.md         # This file
├── index.js              # Entry point (re-exports from src/)
├── package.json          # Dependencies and scripts
├── .env.template         # Environment variable template
└── .env                  # Environment variables (not in git)
```

## Functions

### 1. chatbot
**Endpoint:** `https://region-project.cloudfunctions.net/chatbot`

AI-powered chatbot using Google Gemini 2.0 Flash API.

**Features:**
- Professional data context from GitHub Gist
- Input validation and sanitization
- Error handling with fallbacks
- CORS and security headers

**Request:**
```json
{
  "message": "Tell me about Jay's experience"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chatbot response generated successfully",
  "data": {
    "response": "AI-generated response about Jay..."
  },
  "timestamp": "2025-07-19T12:00:00.000Z"
}
```

### 2. sendContactEmail
**Endpoint:** `https://region-project.cloudfunctions.net/sendContactEmail`

Handles contact form submissions with dual email system.

**Features:**
- Input validation and sanitization
- Professional HTML email templates
- AI-generated auto-replies
- Spam detection
- Comprehensive error handling

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Portfolio Inquiry",
  "message": "I'm interested in your work..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "message": "Thank you for your message! I'll get back to you soon.",
    "sent": true,
    "timestamp": "2025-07-19T12:00:00.000Z"
  }
}
```

## Services

### AIService
Handles all AI-related operations:
- Fetches professional data from GitHub Gist
- Integrates with Google Gemini 2.0 Flash API
- Generates contextual responses
- Provides fallback responses for errors

**Key Methods:**
- `generateChatbotResponse(message)` - For website chat
- `generateEmailResponse(contactData)` - For auto-reply emails
- `fetchProfessionalData()` - Gets latest data from Gist

### EmailService
Manages email operations:
- SMTP transporter configuration
- HTML email template rendering
- Dual email system (notification + auto-reply)
- Professional email formatting

**Key Methods:**
- `sendNotificationEmail(contactData)` - Sends to Jay
- `sendAutoReplyEmail(contactData, aiResponse)` - Sends to user
- `verifyConfiguration()` - Tests email setup

## Utilities

### validation.js
Comprehensive input validation:
- Contact form validation
- Email format validation
- Spam detection
- Input sanitization
- Length constraints

### errorHandler.js
Error handling and logging:
- Custom error classes
- User-friendly error messages
- Structured logging
- HTTP status code mapping
- Environment-specific error details

### cors.js
CORS and security:
- Cross-origin request handling
- Security headers
- Origin validation
- Preflight request handling

## Environment Variables

Required variables (add to `.env` file):

```env
# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here

# SMTP Settings
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Optional
NODE_ENV=production
LOG_LEVEL=info
```

## Scripts

### Development
```bash
npm run serve          # Start Firebase emulator
npm run shell          # Firebase functions shell
npm run test           # Run all tests
npm run lint           # Code linting
npm run format         # Code formatting
```

### Deployment
```bash
npm run build          # Validate and build
npm run deploy         # Deploy functions
npm run logs           # View function logs
```

### Maintenance
```bash
npm run check-updates  # Check for package updates
npm run security-audit # Security vulnerability check
npm run validate       # Validate code and environment
```

## Testing

### Unit Tests
```bash
npm run test:unit
```
Tests individual components in isolation.

### Integration Tests
```bash
npm run test:integration
```
Tests complete functions with Firebase emulator.

### Manual Testing
```bash
firebase emulators:start --only functions
# Then use Postman or curl to test endpoints
```

## Error Handling

The system uses a comprehensive error handling approach:

1. **Input Validation**: All inputs are validated and sanitized
2. **Service Errors**: API failures have fallback responses
3. **System Errors**: Infrastructure issues are logged and handled gracefully
4. **User-Friendly Messages**: Technical errors are translated to user-friendly messages

### Error Categories
- `VALIDATION_ERROR` - Invalid input data
- `EMAIL_ERROR` - Email service issues
- `API_ERROR` - External API failures
- `NETWORK_ERROR` - Network connectivity issues
- `SYSTEM_ERROR` - General system errors

## Security

### Best Practices Implemented
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Security headers
- ✅ Spam detection
- ✅ Error message sanitization

### CORS Configuration
- Production: Specific allowed origins
- Development: Wildcard allowed for testing
- Preflight request handling
- Security headers included

## Monitoring & Logging

### Log Levels
- `INFO` - General information
- `WARN` - Warning conditions
- `ERROR` - Error conditions with stack traces

### Monitoring Points
- Function invocations
- Email sending success/failure
- AI API calls
- Validation failures
- Error rates

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Email service tested
- [ ] AI API key valid
- [ ] CORS origins updated for production
- [ ] Logs monitoring enabled
- [ ] Error handling tested

### Common Issues

**Functions not working?**
- Check Firebase Blaze plan is active
- Verify environment variables
- Check function logs: `firebase functions:log`

**Email not sending?**
- Verify Gmail app password
- Check SMTP settings
- Test with `emailService.verifyConfiguration()`

**AI responses failing?**
- Check Gemini API key validity
- Verify Gist URL accessibility
- Check API quotas

## Contributing

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Add JSDoc comments for functions
- Use meaningful variable names

### Adding New Features
1. Create modular services in `src/services/`
2. Add utilities to `src/utils/`
3. Update tests in `test/`
4. Update documentation

### Testing Requirements
- Unit tests for all utilities
- Integration tests for functions
- Error case coverage
- Input validation tests

## Version History

- **2.1.0** - Production-ready modular architecture
- **2.0.0** - AI integration with Gemini 2.0 Flash
- **1.0.0** - Initial Firebase Functions implementation
