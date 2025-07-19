# 🚀 Quick Start Guide

Get your Jay Rathod Portfolio up and running in minutes! These scripts handle both **initial deployment** and **ongoing redeployments**.

## ⚡ **One-Command Deployment & Redeployment**

### **Linux/macOS**
```bash
chmod +x deploy.sh && ./deploy.sh
```

### **Windows PowerShell**
```powershell
.\deploy.ps1
```

### **Windows Command Prompt**
```batch
deploy.bat
```

## � **Redeployment Examples**

### **Quick Updates**
```bash
# Updated functions only (email templates, AI logic)
./deploy.sh --functions-only        # Linux/macOS
.\deploy.ps1 -FunctionsOnly         # Windows PowerShell
.\deploy.bat functions              # Windows CMD

# Updated website only (HTML, CSS, images)
./deploy.sh --hosting-only          # Linux/macOS  
.\deploy.ps1 -HostingOnly           # Windows PowerShell
.\deploy.bat hosting                # Windows CMD

# Fast redeployment (skip npm install)
./deploy.sh --no-build              # Linux/macOS
.\deploy.ps1 -NoBuild               # Windows PowerShell
```

## �📋 **Before You Start**

1. **Install Prerequisites:**
   - [Node.js 18+](https://nodejs.org/)
   - Firebase CLI: `npm install -g firebase-tools`
   - Git

2. **Setup Environment:**
   - Copy `functions/.env.template` to `functions/.env`
   - Add your API keys (Gemini AI, Gmail app password)

3. **Firebase Login:**
   ```bash
   firebase login
   ```

4. **Deploy/Redeploy with Detailed Commands:**

### **🐧 Linux/macOS Commands**
```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Full deployment
./deploy.sh

# Functions only (for email/AI updates)
./deploy.sh functions

# Hosting only (for website updates)
./deploy.sh hosting

# Fast redeployment (skip dependencies)
./deploy.sh --no-build
./deploy.sh functions --no-build
./deploy.sh hosting --no-build
```

### **🪟 Windows Command Prompt (Recommended)**
```batch
# Full deployment
deploy.bat

# Functions only (for email/AI updates)
deploy.bat functions

# Hosting only (for website updates)
deploy.bat hosting

# Fast redeployment (skip dependencies)
deploy.bat -NoBuild
deploy.bat functions -NoBuild
deploy.bat hosting -NoBuild
```

### **🪟 Windows PowerShell (Alternative)**
```powershell
# May need to run first: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Full deployment
.\deploy.ps1

# Functions only (for email/AI updates)
.\deploy.ps1 -FunctionsOnly

# Hosting only (for website updates)
.\deploy.ps1 -HostingOnly

# Fast redeployment (skip dependencies)
.\deploy.ps1 -NoBuild
.\deploy.ps1 -FunctionsOnly -NoBuild
.\deploy.ps1 -HostingOnly -NoBuild
```

## 🔄 **Making Changes & Updates**

### **Common Update Scenarios:**
| What Changed? | Command to Use |
|---------------|----------------|
| 📧 Email templates | `deploy.bat functions -NoBuild` |
| 🎨 Website styling | `deploy.bat hosting -NoBuild` |
| 🤖 Chatbot logic | `deploy.bat functions` |
| 📝 Portfolio content | `deploy.bat hosting -NoBuild` |
| 🔐 Environment variables | `deploy.bat functions` |
| 🆕 New project added | `deploy.bat hosting` |
| 📦 Package updates | `deploy.bat` (full) |

### **Making Your First Change:**
1. **Edit a file** (e.g., `public/index.html` or `functions/index.js`)
2. **Choose the right command** from the table above
3. **Run the command** - your changes go live in seconds!
4. **Verify** by checking the live URLs shown after deployment

## 🎯 **That's It!**

Your portfolio will be live at: `https://about-jay-rathod.web.app`

**For ongoing updates:** Just run the same commands whenever you make changes!

## 📚 **Need More Details?**

- **📖 Complete Step-by-Step Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive instructions for all platforms
- **📋 Full Setup Guide**: [README.md](README.md) - Complete project documentation
- **🔧 Troubleshooting**: [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md) - All commands and solutions
- **📁 Project Structure**: [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) - Understanding the codebase
- **📦 Dependencies**: [DEPENDENCIES.md](DEPENDENCIES.md) - Package management guide

**💡 Pro Tip**: Bookmark [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - it has everything you need for deployment and ongoing updates!
