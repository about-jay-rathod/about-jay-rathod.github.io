# Security Documentation

Comprehensive security implementation and policies for the Jay Rathod Portfolio project.

## 🔒 Security Overview

This application implements enterprise-grade security measures to protect against common web vulnerabilities and API abuse.

## 🛡️ Security Features

### Input Validation & Sanitization
- **XSS Protection**: HTML/script tag removal
- **SQL Injection Prevention**: Parameterized queries
- **Input Length Limits**: Prevents buffer overflow
- **Content Filtering**: Inappropriate content blocking
- **Email Validation**: Format and domain verification

### Authentication & Authorization
- **Origin Validation**: CORS protection
- **Request Headers**: Required authentication headers
- **HMAC Signatures**: Request integrity verification
- **IP-based Tracking**: Abuse detection and blocking

### Rate Limiting & Abuse Prevention
- **Chatbot API**: 10 requests per 15 minutes per IP
- **Contact API**: 3 requests per hour per IP
- **Progressive Penalties**: Increasing timeouts for repeat offenders
- **IP Blocking**: Automatic blocking of abusive IPs

## 🔧 Security Configuration

### Environment Variables Security
```bash
# Production (Firebase Console)
GEMINI_API_KEY=secure_key_managed_by_firebase
EMAIL_USER=secure_email_managed_by_firebase
EMAIL_PASS=secure_password_managed_by_firebase

# Development (.env - NEVER COMMIT)
GEMINI_API_KEY=your_dev_key
EMAIL_USER=your_dev_email
EMAIL_PASS=your_dev_password
```

### CORS Configuration
```javascript
// Allowed origins for API access
ALLOWED_ORIGINS: [
  'https://about-jay-rathod.web.app',
  'https://about-jay-rathod.firebaseapp.com',
  'http://localhost:5000', // Development only
  'http://127.0.0.1:5000'  // Development only
]
```

### Rate Limiting Rules
```javascript
RATE_LIMITS: {
  chatbot: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                  // 10 requests
    message: 'Too many chatbot requests'
  },
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour  
    max: 3,                   // 3 requests
    message: 'Too many contact form submissions'
  }
}
```

## 🚨 Threat Protection

### XSS (Cross-Site Scripting) Protection
```javascript
// Input sanitization
function sanitizeInput(input) {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}
```

### CSRF (Cross-Site Request Forgery) Protection
- **Origin Validation**: Requests must come from authorized domains
- **Header Validation**: `X-Requested-With` header required
- **Content-Type Validation**: Proper JSON content type required

### Injection Attack Prevention
- **Input Validation**: Strict input format requirements
- **Parameterized Queries**: No dynamic query construction
- **Output Encoding**: Proper encoding of all outputs

### DDoS Protection
- **Rate Limiting**: Prevents automated attacks
- **IP Blocking**: Automatic blocking of repeat offenders
- **Resource Limits**: Function timeout and memory limits

## 🔍 Security Monitoring

### Automated Security Scanning
```bash
# Run security check before each commit
node security-check.js

# Output: 
# ✅ No hardcoded API keys found
# ✅ No exposed URLs found  
# ✅ No sensitive data in logs
# 🚀 Code is safe to commit to public repository
```

### Security Event Logging
```javascript
// Security events are logged but contain no sensitive data
{
  timestamp: '2025-07-19T10:30:00.000Z',
  event: 'RATE_LIMIT_EXCEEDED',
  ip: 'xxx.xxx.xxx.xxx', // Partially masked
  endpoint: '/chatbot',
  action: 'BLOCKED'
}
```

### Monitoring Alerts
- **Rate Limit Exceeded**: Multiple requests from same IP
- **Invalid Origin**: Requests from unauthorized domains  
- **Malformed Requests**: Potential attack attempts
- **Function Errors**: Unexpected errors that might indicate attacks

## 🔐 Data Protection

### Data Encryption
- **In Transit**: HTTPS/TLS 1.3 for all communications
- **At Rest**: Firebase encryption for stored data
- **API Keys**: Secured in Firebase environment variables

### Data Retention
- **Logs**: Automatically expire after 30 days
- **User Data**: No personal data stored permanently
- **Analytics**: Anonymous usage data only

### Privacy Compliance
- **No Tracking**: No personal data collection
- **No Cookies**: Stateless authentication
- **No Storage**: User messages not persisted

## 🛠️ Security Implementation

### Middleware Security Stack
```javascript
// Request processing order:
1. CORS Validation
2. Rate Limiting Check
3. Input Sanitization
4. Content Validation
5. Business Logic
6. Response Sanitization
7. Security Headers Addition
```

### Security Headers
```javascript
// Automatically added to all responses
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY', 
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': "default-src 'self'"
}
```

### Error Handling Security
```javascript
// Production error responses never expose:
- Stack traces
- File paths
- Database schemas  
- Internal server details
- Environment variables

// Only safe error messages returned:
{
  "success": false,
  "error": "Invalid input format",
  "code": "VALIDATION_ERROR"
}
```

## ⚠️ Security Best Practices

### For Developers

**DO:**
- ✅ Always run `node security-check.js` before commits
- ✅ Use environment variables for all secrets
- ✅ Test rate limiting and CORS locally
- ✅ Validate all inputs on both client and server
- ✅ Log security events for monitoring

**DON'T:**
- ❌ Never commit `.env` files
- ❌ Don't hardcode API keys in source code
- ❌ Don't expose internal error details
- ❌ Don't trust client-side validation alone
- ❌ Don't log sensitive user data

### For Deployment

**Pre-Deployment:**
```bash
# 1. Security scan
node security-check.js

# 2. Check for secrets
grep -r "AIza" . --exclude-dir=node_modules
grep -r "password" . --exclude-dir=node_modules

# 3. Verify .gitignore
cat .gitignore | grep .env
```

**Post-Deployment:**
```bash
# 1. Test CORS protection
curl -X POST https://about-jay-rathod.web.app/api/chatbot \
  -H "Origin: https://malicious-site.com" \
  -d '{"message": "test"}' 
# Should fail with CORS error

# 2. Test rate limiting
# Make 11+ requests quickly through the website - should get rate limited

# 3. Test input validation  
curl -X POST https://about-jay-rathod.web.app/api/chatbot \
  -d '{"message": "<script>alert(1)</script>"}' 
# Should sanitize the script tag
```

## 🚨 Incident Response

### Security Incident Handling
1. **Detection**: Monitor logs and error rates
2. **Assessment**: Determine scope and impact
3. **Containment**: Block malicious IPs if needed
4. **Investigation**: Analyze logs and attack vectors
5. **Recovery**: Apply fixes and redeploy
6. **Lessons Learned**: Update security measures

### Emergency Procedures
```bash
# Disable functions temporarily (last resort)
firebase functions:config:unset some.key
firebase deploy --only functions

# Block specific IPs (implement IP blocking in security middleware)
# Monitor and analyze attack patterns
firebase functions:log | grep -i "BLOCKED\|ERROR"
```

## 🔍 Security Audit Checklist

### Monthly Security Review
- [ ] Run automated security scan
- [ ] Review function logs for suspicious activity
- [ ] Check for new security vulnerabilities in dependencies
- [ ] Verify rate limiting effectiveness
- [ ] Test CORS configuration
- [ ] Review error handling and logging

### Quarterly Security Audit
- [ ] Full penetration testing
- [ ] Dependency vulnerability assessment
- [ ] Code security review
- [ ] Security configuration review
- [ ] Incident response plan testing
- [ ] Security documentation updates

## 📞 Security Contact

### Reporting Security Issues
- **Email**: jayrathod.ca@gmail.com
- **Subject**: [SECURITY] Vulnerability Report
- **Response Time**: 24 hours for critical issues

### Security Information
- **Security Policy**: This document
- **Last Security Audit**: 2025-07-19
- **Next Security Review**: 2025-10-19
- **Security Framework**: OWASP Top 10 compliance

---

**Security is everyone's responsibility!** Report any security concerns immediately. 🔒
