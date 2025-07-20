# Development Guide

Complete guide for local development, testing, and contributing to the Jay Rathod Portfolio project.

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **npm** v8+
- **Firebase CLI** (install with `npm install -g firebase-tools`)
- **Git**

### Setup (5 minutes)
```bash
# 1. Clone repository
git clone https://github.com/about-jay-rathod/about-jay-rathod.github.io.git
cd about-jay-rathod.github.io

# 2. Install dependencies
cd functions && npm install && cd ..

# 3. Setup environment
cp functions/.env.example functions/.env
# Edit functions/.env with your API keys

# 4. Login to Firebase
firebase login

# 5. Start development server
firebase serve
```

**Your site is now running at:**
- **Website**: http://localhost:5000
- **Functions**: http://localhost:5001
- **Firebase UI**: http://localhost:4000

## 🛠️ Development Commands

### Daily Development
```bash
# Start all services
firebase serve
# OR with emulators UI
firebase emulators:start

# Install packages
cd functions && npm install package-name

# Check for updates
npm outdated
npm update

# Security audit
npm audit
npm audit fix
```

### Testing
```bash
# Test chatbot API
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"message": "Hello"}'

# Test contact form
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"name": "Test", "email": "test@example.com", "subject": "Test", "message": "Hello"}'
```

### Debugging
```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only chatbot

# Check function status
firebase functions:list

# Debug with verbose output
firebase serve --debug
```

## 📁 Project Structure

```
├── public/                 # Frontend files
│   ├── index.html         # Main webpage
│   ├── assets/           
│   │   ├── css/          # Styles
│   │   ├── js/           # JavaScript
│   │   │   ├── main.js   # Main app logic
│   │   │   └── config.js # Environment config
│   │   └── img/          # Images
│   └── projects/         # Project pages
├── functions/             # Firebase Functions
│   ├── src/              # Function source code
│   │   ├── index.js      # Main entry point
│   │   ├── services/     # AI and Email services
│   │   ├── middleware/   # Security middleware
│   │   └── utils/        # Utilities
│   ├── .env.example      # Environment template
│   └── package.json      # Function dependencies
├── Documentation/         # All documentation
└── Deployment/           # Deployment scripts
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Required for development
GEMINI_API_KEY=your_google_ai_api_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=recipient_email

# Optional settings
NODE_ENV=development
DEBUG=true
RATE_LIMIT_MAX_REQUESTS=50
```

### Firebase Configuration
```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {"source": "/api/**", "function": "api"}
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Functions not working?**
```bash
# Check Firebase login
firebase projects:list

# Restart emulators
firebase emulators:kill
firebase serve

# Clear cache
firebase logout && firebase login
```

**CORS errors?**
```bash
# Check CORS configuration in functions/src/middleware/security.js
# Ensure localhost is in ALLOWED_ORIGINS
```

**Environment variables not loading?**
```bash
# Check .env file exists
ls -la functions/.env

# Check .env format (no spaces around =)
# Check for proper quotes around values with spaces
```

**Dependencies issues?**
```bash
# Clear and reinstall
cd functions
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Making Changes

### Frontend Changes
1. Edit files in `public/`
2. Refresh browser (auto-reload enabled)
3. Test functionality

### Function Changes  
1. Edit files in `functions/src/`
2. Firebase automatically reloads functions
3. Test with curl commands above

### Adding New Features
1. Create feature branch: `git checkout -b feature-name`
2. Make changes and test locally
3. Run security check: `node security-check.js`
4. Commit changes: `git commit -m "Add feature"`
5. Push and create pull request

## 📊 Performance Tips

### Development Speed
- Use `firebase serve --only functions` for function-only changes
- Use `firebase serve --only hosting` for frontend-only changes
- Enable debug mode in `.env` for detailed logging

### Testing Efficiency
- Keep emulators running during development
- Use browser dev tools for frontend debugging
- Use Firebase console for function monitoring

## 🔐 Security Notes

- **Never commit** `.env` files
- **Always run** `node security-check.js` before commits
- **Test** rate limiting and input validation
- **Check** CORS settings for production domains

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly with `firebase serve`
5. **Run** security checks
6. **Submit** pull request with clear description

## 📞 Need Help?

- **Issues**: Create GitHub issue with error details
- **Questions**: Check existing documentation first
- **Emergency**: Email jayrathod.ca@gmail.com

---

**Happy coding!** 🚀
