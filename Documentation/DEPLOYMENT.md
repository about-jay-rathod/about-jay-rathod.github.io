# Deployment Guide

Complete guide for deploying the Jay Rathod Portfolio to production environments.

## 🚀 Quick Deploy

### Automated Deployment (Recommended)
```bash
# Linux/macOS
./Deployment/Scripts/deploy.sh

# Windows Command Prompt
./Deployment/Scripts/deploy.bat

# Windows PowerShell
./Deployment/Scripts/deploy.ps1
```

### Manual Deployment
```bash
firebase deploy
```

## 🔧 Deployment Options

### Deploy Everything
```bash
firebase deploy
# Deploys hosting + functions + firestore rules
```

### Deploy Functions Only
```bash
firebase deploy --only functions
# Perfect for API updates, email logic changes
```

### Deploy Hosting Only  
```bash
firebase deploy --only hosting
# Perfect for frontend updates, styling changes
```

### Deploy Specific Function
```bash
firebase deploy --only functions:chatbot
firebase deploy --only functions:sendContactEmail
```

## 🛠️ Pre-Deployment Checklist

### ✅ Security Verification
```bash
# 1. Run security scan
node security-check.js

# 2. Check for hardcoded secrets
grep -r "AIza" . --exclude-dir=node_modules
grep -r "firebase" . --exclude-dir=node_modules

# 3. Verify .env is not committed
git status | grep .env
```

### ✅ Environment Setup
```bash
# 1. Check Firebase project
firebase use --add about-jay-rathod

# 2. Verify dependencies
cd functions && npm audit

# 3. Test locally first
firebase serve
```

### ✅ Function Testing
```bash
# Test chatbot API
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "deployment test"}'

# Test contact API
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deploy Test",
    "email": "test@example.com",
    "subject": "Deployment Check",
    "message": "Testing before deployment"
  }'
```

## 🔥 Firebase Deployment

### Initial Setup
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Select project
firebase use about-jay-rathod
```

### Production Deployment
```bash
# Full deployment
firebase deploy --project about-jay-rathod

# With deployment message
firebase deploy -m "Updated chatbot responses and contact form validation"

# Force deployment (if needed)
firebase deploy --force
```

### Deployment Verification
```bash
# 1. Check deployment status
firebase projects:list

# 2. Verify functions are live
firebase functions:list

# 3. Test production URLs
curl https://about-jay-rathod.web.app

# 4. Check function logs
firebase functions:log --limit 10
```

## 🌐 Production URLs

After deployment, your site will be available at:

### Primary URLs
- **Website**: https://about-jay-rathod.web.app
- **Alternative**: https://about-jay-rathod.firebaseapp.com

### API Endpoints (Secure - Access via website only)
- **Chatbot**: Configured dynamically for security
- **Contact**: Configured dynamically for security
- **Local Dev**: http://localhost:5001/YOUR-PROJECT-ID/us-central1/[function-name]

## 🚨 Troubleshooting Deployment

### Common Issues

**Deploy fails with permission error?**
```bash
firebase login --reauth
firebase use about-jay-rathod
```

**Functions not updating?**
```bash
# Force function deployment
firebase deploy --only functions --force

# Check function logs
firebase functions:log
```

**Website not loading?**
```bash
# Check hosting deployment
firebase hosting:sites:list

# Verify files deployed
firebase hosting:clone about-jay-rathod temp-site
```

**Environment variables not working?**
```bash
# Functions use environment variables from Firebase Console
# NOT from .env files in production

# Check Firebase Console > Functions > Configuration
```

## ⚡ Performance Optimization

### Before Deployment
```bash
# 1. Optimize images
# Check public/assets/img/ for large files

# 2. Minify assets (if not already)
# CSS and JS files are optimized for production

# 3. Check bundle size
cd functions && npm run build-check
```

### After Deployment
```bash
# 1. Test load speed
curl -w "@curl-format.txt" -o /dev/null -s https://about-jay-rathod.web.app

# 2. Check function performance
firebase functions:log --limit 50

# 3. Monitor function quotas
# Check Firebase Console > Usage
```

## 🔒 Production Security

### Security Configuration
Production automatically enables:
- **HTTPS**: All traffic encrypted
- **CORS**: Restricted to authorized domains
- **Rate Limiting**: API abuse prevention
- **Input Validation**: XSS/injection protection
- **Error Handling**: No sensitive data exposed

### Security Monitoring
```bash
# Check security logs
firebase functions:log | grep -i error

# Monitor rate limiting
firebase functions:log | grep -i rate

# Check for blocked requests
firebase functions:log | grep -i blocked
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# 1. Website availability
curl -I https://about-jay-rathod.web.app

# 2. Function health (do this through website, not directly)
# Visit website and test chatbot/contact form

# 3. Performance check
firebase functions:log --limit 5
```

### Regular Maintenance
```bash
# Weekly: Check function logs
firebase functions:log --limit 50

# Monthly: Update dependencies
cd functions
npm update
npm audit fix
firebase deploy --only functions

# Quarterly: Review security settings
node security-check.js
```

## 🔄 Rollback Procedures

### Rollback to Previous Version
```bash
# Check deployment history
firebase hosting:versions:list

# Rollback hosting
firebase hosting:sites:release about-jay-rathod VERSION_ID

# Rollback functions (redeploy previous code)
git checkout PREVIOUS_COMMIT
firebase deploy --only functions
git checkout main
```

### Emergency Procedures
```bash
# Disable functions temporarily
# (Not recommended - better to fix and redeploy)

# Quick hotfix deployment
git checkout main
# Make minimal fix
firebase deploy --only functions
```

## 🎯 Deployment Strategies

### Development → Production
1. **Feature Branch**: Develop in feature branch
2. **Test Locally**: `firebase serve` 
3. **Merge to Main**: Create PR, merge after review
4. **Deploy**: `firebase deploy`
5. **Verify**: Test production site

### Hotfix Deployment
1. **Identify Issue**: Check logs/reports
2. **Create Fix**: Minimal change in hotfix branch  
3. **Test**: Verify fix locally
4. **Fast Deploy**: `firebase deploy --only functions`
5. **Monitor**: Check logs for resolution

### Feature Deployment
1. **Test Thoroughly**: Full local testing
2. **Staged Deploy**: Deploy functions first, then hosting
3. **Monitor**: Watch logs for issues
4. **Gradual Rollout**: Monitor user feedback

## 📞 Deployment Support

### Before Deploying
- Run all tests locally
- Check security scan passes
- Verify environment variables
- Test all API endpoints

### During Deployment  
- Monitor Firebase Console
- Watch deployment logs
- Test immediately after deploy

### After Deployment
- Check website loads correctly
- Test chatbot and contact form
- Monitor function logs
- Verify performance metrics

### Getting Help
- **Firebase Issues**: Check Firebase Console logs
- **Code Issues**: Review GitHub commits
- **Performance**: Monitor Firebase Analytics
- **Security**: Run security audit

---

**Ready to deploy?** Make sure you've completed the pre-deployment checklist above! 🚀
