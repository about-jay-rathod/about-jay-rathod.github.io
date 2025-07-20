# API Documentation

Complete API reference for the Jay Rathod Portfolio chatbot and contact form endpoints.

## 🚀 Quick Reference

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/chatbot` | POST | AI-powered chat responses | 10/15min |
| `/sendContactEmail` | POST | Send contact form emails | 3/hour |

## 🔧 Environment Detection & URL Rewrites

The frontend automatically detects the environment and uses appropriate endpoints:

### Local Development
```javascript
// Automatically set when hostname = localhost
// Local development endpoints (Firebase emulators)
chatbot: 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot'
contact: 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail'
// Direct function URLs for local testing
```

### Production (Firebase Hosting)
```javascript
// Automatically set when hostname contains 'firebase'
// Uses secure URL rewrites - no direct function URLs exposed
chatbot: '/api/chatbot'
contact: '/api/sendContactEmail'
```

### 🔄 How URL Rewrites Work

Firebase hosting automatically forwards API requests:

```
User Request:    /api/chatbot
                      ↓ (Firebase rewrites)
**Direct URL (Not Recommended):**
```
Actual Function: https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/chatbot
```
                      ↓ (Response)
User Sees:       Clean response from /api/chatbot
```

**Benefits:**
- ✅ **Security**: Real function URLs never exposed to users
- ✅ **Simplicity**: Clean, user-friendly API endpoints  
- ✅ **Flexibility**: Can change backend without updating frontend
- ✅ **Performance**: Firebase can cache responses at hosting level

## 🤖 Chatbot API

### Endpoint
```
POST /chatbot
```

### Request Headers
```
Content-Type: application/json
X-Requested-With: XMLHttpRequest
Origin: https://about-jay-rathod.web.app (or localhost for development)
```

### Request Body
```json
{
  "message": "Tell me about your experience with React"
}
```

### Response (Success)
```json
{
  "success": true,
  "response": "I have extensive experience with React, having built several production applications including this portfolio website. I'm skilled in React hooks, state management, and modern React patterns.",
  "timestamp": "2025-07-19T10:30:00.000Z"
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again in 10 minutes.",
  "code": "RATE_LIMIT_EXCEEDED",
  "timestamp": "2025-07-19T10:30:00.000Z"
}
```

### Example Usage
```bash
# Development
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"message": "What technologies do you use?"}'

# JavaScript (frontend automatically handles URLs)
const response = await fetch(getAPIEndpoint('chatbot'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  body: JSON.stringify({ message: userMessage })
});
```

### Security Features
- **Rate Limiting**: 10 requests per 15 minutes per IP
- **Input Sanitization**: HTML/script tag removal
- **CORS Protection**: Restricted to authorized domains
- **Content Filtering**: Inappropriate content blocking

## 📧 Contact Email API

### Endpoint
```
POST /sendContactEmail
```

### Request Headers
```
Content-Type: application/json
X-Requested-With: XMLHttpRequest
Origin: https://about-jay-rathod.web.app (or localhost for development)
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hi Jay, I'd like to discuss a potential collaboration on a React project."
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Email sent successfully",
  "timestamp": "2025-07-19T10:30:00.000Z"
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Invalid email address format",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-07-19T10:30:00.000Z"
}
```

### Example Usage
```bash
# Development  
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Freelance Inquiry",
    "message": "Hello, I have a React project that needs development."
  }'

# JavaScript (frontend automatically handles URLs)
const response = await fetch(getAPIEndpoint('contact'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  body: JSON.stringify({ name, email, subject, message })
});
```

### Validation Rules
- **name**: Required, 2-50 characters, letters/spaces only
- **email**: Required, valid email format, max 100 characters
- **subject**: Required, 5-100 characters
- **message**: Required, 10-2000 characters

### Security Features
- **Rate Limiting**: 3 requests per hour per IP
- **Input Sanitization**: XSS protection, HTML stripping
- **Email Validation**: Format and domain validation
- **Spam Protection**: Content filtering and abuse detection

## 🚨 Error Codes

### Common Error Responses

| Code | Description | Solution |
|------|-------------|----------|
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and try again |
| `VALIDATION_ERROR` | Invalid input data | Check request format |
| `CORS_ERROR` | Unauthorized origin | Use authorized domain |
| `MISSING_HEADERS` | Required headers missing | Add X-Requested-With header |
| `INTERNAL_ERROR` | Server error | Report to admin |

### Rate Limit Headers
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9  
X-RateLimit-Reset: 1642678800
```

## 🔒 Security Implementation

### Request Authentication
All requests are validated for:
- Valid origin (CORS)
- Required headers present
- Input sanitization
- Rate limit compliance

### Data Protection
- No sensitive data logged
- Input sanitization prevents XSS
- Rate limiting prevents abuse
- HTTPS enforced in production

### Monitoring
- Request logging for debugging
- Error tracking and alerting  
- Performance metrics
- Security event monitoring

## 📱 Frontend Integration

### Configuration
The frontend uses `config.js` for environment-specific endpoint detection:

```javascript
// Automatically detects environment and sets appropriate URLs
function getAPIEndpoint(type) {
  if (window.portfolioConfig && window.portfolioConfig.apiEndpoints) {
    return window.portfolioConfig.apiEndpoints[type];
  }
  return `/api/${type}`; // fallback
}
```

### Error Handling
```javascript
try {
  const response = await fetch(apiUrl, options);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

## 🧪 Testing

### Health Check
```bash
# Test if functions are running
curl http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot \
  -X POST -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"message": "health check"}'
```

### Load Testing
```bash
# Test rate limiting (run multiple times quickly)
for i in {1..15}; do
  curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot \
    -H "Content-Type: application/json" \
    -H "X-Requested-With: XMLHttpRequest" \
    -d '{"message": "test '$i'"}'
done
```

## 🔧 Customization

### Adding New Endpoints
1. Create function in `functions/src/index.js`
2. Add security middleware
3. Update `config.js` endpoints
4. Add to this documentation

### Modifying Rate Limits
Edit `functions/src/config/security.js`:
```javascript
RATE_LIMITS: {
  chatbot: { windowMs: 15 * 60 * 1000, max: 10 },
  contact: { windowMs: 60 * 60 * 1000, max: 3 }
}
```

## 📞 Support

- **API Issues**: Check Firebase Functions logs
- **Rate Limits**: Contact admin for adjustment
- **Feature Requests**: Create GitHub issue
- **Security Concerns**: Email jayrathod.ca@gmail.com

---

**Need help?** Check the [Development Guide](DEVELOPMENT.md) for local setup instructions.
