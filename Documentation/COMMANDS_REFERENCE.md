# 🎯 **Complete npm & Firebase Commands Reference**

## **📦 Package Management**

### **Current Package Versions (Updated: January 15, 2024)**

```json
{
  "dependencies": {
    "firebase-functions": "^6.1.0",
    "firebase-admin": "^12.7.0", 
    "nodemailer": "^6.10.1",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1"
  },
  "devDependencies": {
    "firebase-functions-test": "^3.3.0"
  }
}
```

### **Dependency Status Check**
```bash
# Check for outdated packages
npm run check-updates
# OR
npm outdated

# Security audit
npm run security-audit
# OR 
npm audit

# Update all dependencies
npm run update-deps
# OR
npm update

# Fix security vulnerabilities
npm run security-fix
# OR
npm audit fix
```

---

## 🔥 **Firebase CLI Commands**

### **Installation & Setup**
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Check Firebase CLI version
firebase --version

# Login to Firebase
firebase login

# Initialize project (if starting fresh)
firebase init

# List Firebase projects
firebase projects:list

# Set active project
firebase use <project-id>
firebase use about-jay-rathod
```

### **Development & Testing**
```bash
# Serve locally (hosting + functions)
firebase serve

# Serve only hosting
firebase serve --only hosting

# Serve only functions
firebase serve --only functions

# Start emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only functions,hosting
```

### **🔄 Deployment & Redeployment Commands**

#### **📦 Automated Scripts (Initial & Ongoing Deployment)**
Our custom scripts handle both initial deployment and ongoing redeployment:

**Linux/macOS (bash)**
```bash
./deploy.sh             # Full deployment/redeployment
./deploy.sh functions   # Functions only (great for email logic updates)  
./deploy.sh hosting     # Hosting only (great for website updates)
./deploy.sh --no-build  # Skip dependency installation (faster redeployment)
```

**Windows Command Prompt (Recommended for Windows)**
```batch
deploy.bat                # Full deployment/redeployment
deploy.bat functions      # Functions only
deploy.bat hosting        # Hosting only
deploy.bat -NoBuild       # Skip dependency installation (faster redeployment)
```

**Windows PowerShell (Alternative)**
```powershell
.\deploy.ps1              # Full deployment/redeployment
.\deploy.ps1 functions    # Functions only
.\deploy.ps1 hosting      # Hosting only  
.\deploy.ps1 -NoBuild     # Skip dependency installation
```

**💡 Common Redeployment Scenarios:**
- 📧 Updated email template? → `deploy.bat functions`
- 🎨 Changed website styling? → `deploy.bat hosting`
- 🔄 Full system update? → `deploy.bat`
- ⚡ Quick update without rebuilding? → `deploy.bat -NoBuild`

#### **🛠️ Manual Firebase Commands (for advanced users)**
```bash
# Deploy everything (hosting + functions)
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting  
firebase deploy --only hosting

# Deploy specific function
firebase deploy --only functions:chatbot
firebase deploy --only functions:sendContactEmail

# Deploy with message
firebase deploy -m "Updated email system"
```

### **Function Management**
```bash
# View function logs (real-time)
firebase functions:log

# View logs for specific function
firebase functions:log --only chatbot

# View logs with limit
firebase functions:log --limit 25

# Function shell (for testing)
firebase functions:shell

# Delete function
firebase functions:delete functionName

# List functions
firebase functions:list
```

### **Project Information**
```bash
# Show project info
firebase projects:list

# Show current project
firebase use

# Show project URLs
firebase hosting:sites:list

# Show function URLs
firebase functions:list
```

---

## 🛠️ **Node.js & npm Commands**

### **Package Installation**
```bash
# Install production dependencies
npm install --production

# Install all dependencies (including dev)
npm install

# Install specific package
npm install package-name

# Install with exact version
npm install package-name@1.0.0

# Install as dev dependency
npm install --save-dev package-name

# Install globally
npm install -g package-name
```

### **Package Management**
```bash
# List installed packages
npm list

# List top-level packages only
npm list --depth=0

# Show package info
npm info package-name

# Show outdated packages
npm outdated

# Update packages
npm update

# Uninstall package
npm uninstall package-name

# Clean npm cache
npm cache clean --force
```

### **Script Management**
```bash
# Run npm script
npm run script-name

# List all available scripts
npm run

# Our custom scripts:
npm run check-updates     # Check for outdated packages
npm run update-deps       # Update all dependencies  
npm run security-audit    # Run security audit
npm run security-fix      # Fix security issues
npm run serve            # Start Firebase emulators
npm run deploy           # Deploy to Firebase
```

---

## 🔧 **Function-Specific Commands**

### **Our Firebase Functions**
```bash
# Test chatbot function locally
curl -X POST http://localhost:5001/about-jay-rathod/us-central1/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, tell me about Jay"}'

# Test contact form function locally  
curl -X POST http://localhost:5001/about-jay-rathod/us-central1/sendContactEmail \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "subject": "Testing",
    "message": "This is a test message"
  }'
```

### **Production Function URLs**
```bash
# Chatbot API
https://chatbot-r64livvx2q-uc.a.run.app

# Contact Form API
https://sendcontactemail-r64livvx2q-uc.a.run.app
```

---

## 🚀 **Complete Deployment Workflow**

### **Development Workflow**
```bash
# 1. Navigate to project
cd "c:\Users\never\Desktop\personal_data\website"

# 2. Install dependencies
cd functions && npm install

# 3. Start local development
firebase serve

# 4. Test functions locally
# (Use curl commands above)

# 5. Check for issues
firebase functions:log

# 6. Deploy when ready
firebase deploy
```

### **Production Deployment**
```bash
# Full production deployment
cd "c:\Users\never\Desktop\personal_data\website"
npm run check-updates
npm run security-audit
firebase deploy --only functions,hosting
firebase functions:log --limit 5

# Quick function-only update
firebase deploy --only functions
```

---

## 📊 **Monitoring & Maintenance**

### **Weekly Maintenance**
```bash
# 1. Check dependencies
cd functions
npm run check-updates
npm run security-audit

# 2. Review function performance
firebase functions:log --limit 50

# 3. Check website status
curl -s -o /dev/null -w "%{http_code}" https://about-jay-rathod.web.app

# 4. Test APIs
curl -X POST https://chatbot-r64livvx2q-uc.a.run.app \
  -H "Content-Type: application/json" \
  -d '{"message": "health check"}'
```

### **Monthly Updates**
```bash
# 1. Update dependencies
cd functions
npm run update-deps
npm run security-fix

# 2. Test locally
cd ..
firebase serve

# 3. Deploy updates
firebase deploy

# 4. Verify deployment
firebase functions:log --limit 10
```

---

## 🐛 **Troubleshooting Commands**

### **Common Issues**
```bash
# Function deployment fails
firebase deploy --only functions --debug

# Functions not working
firebase functions:log --limit 25

# Clear Firebase cache
firebase logout
firebase login
firebase use about-jay-rathod

# Reset node_modules
cd functions
rm -rf node_modules package-lock.json
npm install

# Check Firebase project status
firebase projects:list
firebase use
```

### **Debug Information**
```bash
# Get detailed version info
firebase --version
node --version  
npm --version

# Show Firebase config
firebase projects:list
firebase use
cat firebase.json

# Show environment variables (CAREFUL - don't expose secrets!)
cd functions
ls -la | grep .env
```

---

## 🔐 **Security Commands**

### **Environment Management**
```bash
# Check .env file exists (never commit this!)
cd functions
ls -la .env

# Verify .gitignore protects secrets
cat ../.gitignore | grep .env

# Test environment variables are loaded
firebase functions:shell
# Then in shell: process.env.GEMINI_API_KEY
```

### **Security Auditing**
```bash
# Run security audit
npm audit

# Fix high/critical issues
npm audit fix

# Force fix all issues (use carefully)
npm audit fix --force

# Check for known vulnerabilities
npm audit --audit-level high
```

---

**Last Updated**: January 18, 2025  
**Next Review**: August 18, 2025  
**Maintained By**: Jay Rathod (jayrathod.ca@gmail.com)
