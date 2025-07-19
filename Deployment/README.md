# 🚀 Deployment Resources

This folder contains all deployment-related resources for the Jay Rathod Portfolio website, including automated scripts, guides, and configuration files.

## 📁 Folder Structure

```
Deployment/
├── 📄 README.md              # This file - Deployment overview
└── 📁 Scripts/               # Platform-specific deployment scripts
    ├── 📄 README.md          # Scripts documentation
    ├── 🐧 deploy.sh          # Linux/macOS deployment script
    ├── 🪟 deploy.ps1         # Windows PowerShell script  
    └── 🪟 deploy.bat         # Windows Command Prompt script
```

## 🎯 Quick Start

### Choose Your Platform

#### 🐧 **Linux/macOS Users**
```bash
# Navigate to project root
cd /path/to/jay-portfolio

# Make script executable (first time only)
chmod +x Deployment/Scripts/deploy.sh

# Deploy everything
./Deployment/Scripts/deploy.sh

# Or deploy specific parts
./Deployment/Scripts/deploy.sh --functions-only
./Deployment/Scripts/deploy.sh --hosting-only
```

#### 🪟 **Windows PowerShell Users**
```powershell
# Navigate to project root
cd C:\path\to\jay-portfolio

# Deploy everything
.\Deployment\Scripts\deploy.ps1

# Or deploy specific parts
.\Deployment\Scripts\deploy.ps1 -FunctionsOnly
.\Deployment\Scripts\deploy.ps1 -HostingOnly
```

#### 🪟 **Windows Command Prompt Users**
```batch
REM Navigate to project root
cd C:\path\to\jay-portfolio

REM Deploy everything
Deployment\Scripts\deploy.bat

REM Or deploy specific parts
Deployment\Scripts\deploy.bat functions
Deployment\Scripts\deploy.bat hosting
```

## 🛠️ Alternative: NPM Scripts

If you prefer using npm commands instead of platform-specific scripts:

```bash
# Full deployment
npm run deploy

# Deploy functions only
npm run deploy:functions

# Deploy hosting only  
npm run deploy:hosting

# Quick deployment (skip some checks)
npm run deploy:quick
```

## 📚 Related Documentation

For comprehensive deployment information, see:

- **[Scripts Documentation](./Scripts/README.md)** - Detailed script usage and troubleshooting
- **[Deployment Guide](../Documentation/DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[Main README](../README.md)** - Project overview and setup
- **[Functions Guide](../Documentation/FUNCTIONS_README.md)** - Firebase Functions specific deployment

## 🔧 Prerequisites

Before using any deployment method, ensure:

### Required Software
- ✅ **Node.js 20+** - Runtime environment
- ✅ **Firebase CLI** - `npm install -g firebase-tools`
- ✅ **Git** - Version control (for security checks)

### Authentication & Configuration
- ✅ **Firebase Login** - `firebase login`
- ✅ **Environment Variables** - `functions/.env` configured
- ✅ **Project Initialization** - Firebase project setup complete

### Development Setup
- ✅ **Dependencies Installed** - `npm install` in root and functions
- ✅ **Tests Passing** - `npm test` successful
- ✅ **Production Ready** - `npm run verify-deployment` passes

## 🚀 Deployment Options

### Full Deployment
Deploys both Firebase Functions and Static Hosting:
- **Scripts**: Use base script without flags
- **NPM**: `npm run deploy`
- **Firebase CLI**: `firebase deploy`

### Functions Only
Deploys serverless backend functions:
- **Scripts**: Use `--functions-only` flag
- **NPM**: `npm run deploy:functions`  
- **Firebase CLI**: `firebase deploy --only functions`

### Hosting Only
Deploys static website content:
- **Scripts**: Use `--hosting-only` flag
- **NPM**: `npm run deploy:hosting`
- **Firebase CLI**: `firebase deploy --only hosting`

## 📊 Deployment Verification

All deployment methods include:
- ✅ **Prerequisites Check** - Validates required tools
- ✅ **Code Quality** - ESLint and Prettier validation
- ✅ **Security Audit** - Checks for vulnerabilities
- ✅ **Environment Check** - Validates configuration
- ✅ **Test Suite** - Runs comprehensive tests
- ✅ **Production Ready** - Final deployment verification

## 🔍 Monitoring

After deployment, monitor your application:

```bash
# View function logs
npm run logs
firebase functions:log

# Check deployment status
firebase projects:list
firebase use --add

# Test deployed functions
curl https://your-function-url
```

## 💡 Tips

### For Development
- Use `npm run dev` for local development
- Use `firebase emulators:start` to test locally
- Run `npm run verify-deployment` before production deployment

### For Production
- Always run full tests before deployment
- Use environment-specific Firebase projects
- Monitor logs after deployment for any issues
- Keep backup of working configuration

### For Maintenance
- Use `--no-build` flag for quick updates (scripts only)
- Deploy functions and hosting separately when needed
- Use `npm run deploy:quick` for minor changes

---

> 🎯 **Choose Your Method**: Scripts offer more control and validation, while npm commands provide quick deployment options. Both methods ensure production-ready deployments.

*Last Updated: July 19, 2025*
