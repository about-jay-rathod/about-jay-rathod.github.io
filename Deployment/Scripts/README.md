# 🚀 Deployment Scripts

This folder contains platform-specific deployment scripts for automating the deployment process of the Jay Rathod Portfolio website to Firebase.

## 📁 Available Scripts

### 🐧 **Linux/macOS** - `deploy.sh`
```bash
# Make executable (first time only)
chmod +x deploy.sh

# Full deployment
./deploy.sh

# Deploy only functions
./deploy.sh --functions-only

# Deploy only hosting
./deploy.sh --hosting-only

# Skip dependency installation
./deploy.sh --no-build
```

### 🪟 **Windows PowerShell** - `deploy.ps1`
```powershell
# Full deployment
.\deploy.ps1

# Deploy only functions
.\deploy.ps1 -FunctionsOnly

# Deploy only hosting
.\deploy.ps1 -HostingOnly

# Skip dependency installation
.\deploy.ps1 -NoBuild
```

### 🪟 **Windows Command Prompt** - `deploy.bat`
```batch
# Full deployment
deploy.bat

# Deploy only functions
deploy.bat functions

# Deploy only hosting
deploy.bat hosting

# Skip dependency installation
deploy.bat -NoBuild
```

## ✨ Script Features

### 🔍 **Automated Checks**
- ✅ **Prerequisites Validation** - Node.js, Firebase CLI, Git availability
- ✅ **Firebase Authentication** - Ensures you're logged into Firebase
- ✅ **Environment Security** - Validates .env files are Git-ignored
- ✅ **Dependency Management** - Automatic npm install/ci operations
- ✅ **Code Syntax Check** - JavaScript validation before deployment

### 🛡️ **Error Handling**
- ✅ **Graceful Failures** - Scripts stop on errors with clear messages
- ✅ **Rollback Ready** - Safe deployment practices
- ✅ **User Feedback** - Colored output and progress indicators
- ✅ **URL Display** - Shows live function endpoints after deployment

### 🎯 **Deployment Options**
- **Full Deployment** - Both Firebase Functions and Hosting
- **Functions Only** - Deploy serverless functions only
- **Hosting Only** - Deploy static website only
- **No Build** - Skip dependency installation (faster redeployments)

## 🚀 Usage Examples

### First-Time Deployment
```bash
# 1. Navigate to project root
cd /path/to/jay-portfolio

# 2. Run appropriate script for your platform
# Linux/macOS:
chmod +x Deployment/Scripts/deploy.sh
./Deployment/Scripts/deploy.sh

# Windows PowerShell:
.\Deployment\Scripts\deploy.ps1

# Windows Command Prompt:
Deployment\Scripts\deploy.bat
```

### Common Redeployment Scenarios

#### **Updated Functions Only** (Email templates, AI logic, etc.)
```bash
# Linux/macOS
./Deployment/Scripts/deploy.sh --functions-only

# Windows PowerShell
.\Deployment\Scripts\deploy.ps1 -FunctionsOnly

# Windows CMD
Deployment\Scripts\deploy.bat functions
```

#### **Updated Website Content** (HTML, CSS, images, etc.)
```bash
# Linux/macOS
./Deployment/Scripts/deploy.sh --hosting-only

# Windows PowerShell
.\Deployment\Scripts\deploy.ps1 -HostingOnly

# Windows CMD
Deployment\Scripts\deploy.bat hosting
```

#### **Quick Redeployment** (Skip npm install for faster updates)
```bash
# Linux/macOS
./Deployment/Scripts/deploy.sh --no-build

# Windows PowerShell
.\Deployment\Scripts\deploy.ps1 -NoBuild

# Windows CMD
Deployment\Scripts\deploy.bat -NoBuild
```

## 🔧 Prerequisites

Before running any deployment script, ensure you have:

### Required Software
- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Firebase CLI** - `npm install -g firebase-tools`
- **Git** - For version control and security checks

### Authentication
- **Firebase Login** - Run `firebase login` first
- **Environment Variables** - Create `functions/.env` with required keys

### Project Setup
- **Dependencies Installed** - `npm install` in root and functions directories
- **Environment Configured** - All required API keys in place
- **Firebase Project** - Initialized with `firebase init`

## 📋 Script Output

### Successful Deployment Example
```
🚀 Deploying Jay Rathod Portfolio to Firebase...

✅ Prerequisites Check - All required tools found
✅ Firebase Authentication - Logged in as user@example.com
✅ Environment Security - .env files properly ignored
✅ Dependencies - Installing/updating packages
✅ Code Validation - JavaScript syntax check passed
✅ Firebase Deploy - Functions and Hosting deployed

🎉 Deployment Successful!

📱 Live URLs:
   Website: https://about-jay-rathod.web.app
   Chatbot: https://chatbot-r64livvx2q-uc.a.run.app
   Contact: https://sendcontactemail-r64livvx2q-uc.a.run.app

🔍 Monitor with:
   firebase functions:log
   npm run logs
```

## 🔧 Troubleshooting

### Common Issues

#### **Firebase CLI Not Found**
```bash
npm install -g firebase-tools
firebase login
```

#### **Node.js Version Issues**
- Ensure Node.js 20+ is installed
- Use nvm to manage Node.js versions if needed

#### **Permission Issues (Linux/macOS)**
```bash
chmod +x Deployment/Scripts/deploy.sh
```

#### **PowerShell Execution Policy (Windows)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Environment Variables Missing**
- Check `functions/.env` file exists
- Verify all required keys are present
- Use `functions/.env.template` as reference

## 🔗 Related Documentation

- **[Main README](../../README.md)** - Project overview
- **[Deployment Guide](../Documentation/DEPLOYMENT_GUIDE.md)** - Detailed deployment documentation
- **[Functions Guide](../Documentation/FUNCTIONS_README.md)** - Firebase Functions documentation

---

> 💡 **Tip**: These scripts are designed for both initial deployment and ongoing maintenance. Use the appropriate flags for your specific needs!

*Last Updated: July 19, 2025*
