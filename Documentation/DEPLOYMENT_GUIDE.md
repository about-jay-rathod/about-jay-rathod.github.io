# Comprehensive Deployment & Redeployment Guide

## Table of Contents
- [Initial Setup & Prerequisites](#initial-setup--prerequisites)
- [First-Time Deployment](#first-time-deployment)
- [Redeployment Workflows](#redeployment-workflows)
- [Common Scenarios & Commands](#common-scenarios--commands)
- [Manual Deployment Commands](#manual-deployment-commands-advanced-users)
- [Troubleshooting](#troubleshooting)
- [Quick Reference Commands](#quick-reference-commands)
- [Deployment Time Estimates](#deployment-time-estimates)
- [Best Practices](#best-practices)

---

## Initial Setup & Prerequisites

### Step 1: Install Prerequisites

#### Linux/macOS
\\\ash
# 1. Install Node.js (if not installed)
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS with Homebrew:
brew install node

# 2. Verify Node.js installation
node --version    # Should be v18.0.0 or higher
npm --version

# 3. Install Firebase CLI globally
npm install -g firebase-tools

# 4. Verify Firebase CLI
firebase --version

# 5. Install Git (if not installed)
# Ubuntu/Debian:
sudo apt-get install git

# macOS:
brew install git
\\\

#### Windows
\\\powershell
# Option 1: Using Chocolatey (Recommended)
# First install Chocolatey from https://chocolatey.org/install

# Install Node.js
choco install nodejs

# Install Git
choco install git

# Option 2: Manual Installation
# 1. Download Node.js from https://nodejs.org/ (LTS version)
# 2. Download Git from https://git-scm.com/download/win
# 3. Install both with default settings

# 3. Install Firebase CLI
npm install -g firebase-tools

# 4. Verify installations
node --version
npm --version
firebase --version
git --version
\\\

### Step 2: Clone Repository
\\\ash
# Clone the repository
git clone https://github.com/about-jay-rathod/about-jay-rathod.github.io.git
cd about-jay-rathod.github.io

# OR if youre starting fresh:
# git clone [your-repo-url]
# cd [your-repo-name]
\\\

### Step 3: Configure Environment
\\\ash
# 1. Copy environment template
cp functions/.env.template functions/.env

# 2. Edit the .env file with your credentials
# Linux/macOS:
nano functions/.env
# OR
vim functions/.env

# Windows:
notepad functions/.env
\\\

**Required Environment Variables:**
\\\env
GEMINI_API_KEY=your_gemini_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
\\\

### Step 4: Firebase Authentication
\\\ash
# Login to Firebase
firebase login

# Set your Firebase project
firebase use your-project-id

# Example:
firebase use about-jay-rathod
\\\

---

## First-Time Deployment

### Linux/macOS - First Deployment
\\\ash
# Make deployment script executable
chmod +x deploy.sh

# Run first deployment
./deploy.sh

# What happens:
# - Checks all prerequisites
# - Validates environment configuration
# - Installs dependencies automatically
# - Validates code syntax
# - Runs security checks
# - Deploys both Functions and Hosting
# - Displays live URLs
\\\

### Windows - First Deployment

#### Command Prompt (Recommended)
\\\atch
# Run first deployment
deploy.bat

# What happens:
# - Checks all prerequisites
# - Validates environment configuration
# - Installs dependencies automatically
# - Validates code syntax
# - Runs security checks
# - Deploys both Functions and Hosting
# - Displays live URLs
\\\

#### Windows PowerShell (Alternative)
\\\powershell
# You might need to allow script execution first
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run first deployment
.\deploy.ps1

# What happens:
# - Checks all prerequisites
# - Validates environment configuration
# - Installs dependencies automatically
# - Validates code syntax
# - Runs security checks
# - Deploys both Functions and Hosting
# - Displays live URLs
\\\

---

## Redeployment Workflows

### Email Function Updates (Most Common)

#### Linux/macOS
\\\ash
# 1. Edit your email function
nano functions/index.js
# OR use your preferred editor

# 2. Test locally (optional)
cd functions
npm run lint        # Check for errors
node -c index.js    # Validate syntax
cd ..

# 3. Deploy only functions (faster)
./deploy.sh functions

# 4. Or deploy functions without rebuilding dependencies (fastest)
./deploy.sh functions --no-build
\\\

#### Windows Command Prompt
\\\atch
# 1. Edit your email function
notepad functions\\index.js
# OR use VS Code: code functions\\index.js

# 2. Test locally (optional)
cd functions
npm run lint
node -c index.js
cd ..

# 3. Deploy only functions (faster)
deploy.bat functions

# 4. Or deploy functions without rebuilding dependencies (fastest)
deploy.bat functions -NoBuild
\\\

#### Windows PowerShell
\\\powershell
# 1. Edit your email function
notepad functions\\index.js
# OR use VS Code: code functions\\index.js

# 2. Test locally (optional)
cd functions
npm run lint
node -c index.js
cd ..

# 3. Deploy only functions (faster)
.\\deploy.ps1 -FunctionsOnly

# 4. Or deploy functions without rebuilding dependencies (fastest)
.\\deploy.ps1 -FunctionsOnly -NoBuild
\\\

### Website Content Updates

#### Linux/macOS
\\\ash
# 1. Edit website files
nano public/index.html
nano public/assets/css/style.css
# OR edit any file in public/ directory

# 2. Deploy only hosting (very fast)
./deploy.sh hosting

# 3. Or deploy hosting without dependency check (fastest)
./deploy.sh hosting --no-build
\\\

#### Windows
\\\atch
# Command Prompt
# 1. Edit website files
notepad public\\index.html
notepad public\\assets\\css\\style.css

# 2. Deploy only hosting (very fast)
deploy.bat hosting

# 3. Or deploy hosting without dependency check (fastest)
deploy.bat hosting -NoBuild
\\\

\\\powershell
# PowerShell
# 1. Edit website files
notepad public\\index.html
notepad public\\assets\\css\\style.css

# 2. Deploy only hosting (very fast)
.\\deploy.ps1 -HostingOnly

# 3. Or deploy hosting without dependency check (fastest)
.\\deploy.ps1 -HostingOnly -NoBuild
\\\

### Full System Redeployment

#### Linux/macOS
\\\ash
# When youve made changes to both website and functions
./deploy.sh

# Skip dependency installation if packages havent changed
./deploy.sh --no-build

# Force fresh installation of dependencies
rm -rf functions/node_modules
./deploy.sh
\\\

#### Windows
\\\atch
# Command Prompt
# When youve made changes to both website and functions
deploy.bat

# Skip dependency installation if packages havent changed
deploy.bat -NoBuild

# Force fresh installation of dependencies
rmdir /s /q functions\\node_modules
deploy.bat
\\\

\\\powershell
# PowerShell
# When youve made changes to both website and functions
.\\deploy.ps1

# Skip dependency installation if packages havent changed
.\\deploy.ps1 -NoBuild

# Force fresh installation of dependencies
Remove-Item -Recurse -Force functions\\node_modules
.\\deploy.ps1
\\\

---

## Common Scenarios & Commands

### Scenario 1: Updated Email Template
\\\ash
# Linux/macOS
./deploy.sh functions --no-build

# Windows Command Prompt
deploy.bat functions -NoBuild

# Windows PowerShell
.\\deploy.ps1 -FunctionsOnly -NoBuild
\\\

### Scenario 2: Changed Website Colors/Styling
\\\ash
# Linux/macOS
./deploy.sh hosting --no-build

# Windows Command Prompt
deploy.bat hosting -NoBuild

# Windows PowerShell
.\\deploy.ps1 -HostingOnly -NoBuild
\\\

### Scenario 3: Added New Portfolio Project
\\\ash
# Linux/macOS (usually involves both website and possibly functions)
./deploy.sh

# Windows Command Prompt
deploy.bat

# Windows PowerShell
.\\deploy.ps1
\\\

### Scenario 4: Security Update/Package Update
\\\ash
# Linux/macOS
cd functions
npm audit fix
npm update
cd ..
./deploy.sh

# Windows Command Prompt
cd functions
npm audit fix
npm update
cd ..
deploy.bat

# Windows PowerShell
cd functions
npm audit fix
npm update
cd ..
.\\deploy.ps1
\\\

### Scenario 5: Environment Variable Changes
\\\ash
# 1. Edit .env file
# Linux/macOS:
nano functions/.env

# Windows:
notepad functions\\.env

# 2. Redeploy functions only
# Linux/macOS:
./deploy.sh functions

# Windows Command Prompt:
deploy.bat functions

# Windows PowerShell:
.\\deploy.ps1 -FunctionsOnly
\\\

---

## Manual Deployment Commands (Advanced Users)

### Firebase CLI Direct Commands
\\\ash
# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# Deploy specific function
firebase deploy --only functions:sendContactEmail
firebase deploy --only functions:chatbot

# Deploy with custom message
firebase deploy -m " Updated email templates and styling\

# Deploy to specific project
firebase deploy --project your-project-id
\\\

### Local Development & Testing
\\\ash
# Start Firebase emulators
firebase emulators:start

# Start only hosting emulator
firebase serve --only hosting

# Start only functions emulator
firebase emulators:start --only functions

# Test functions locally
cd functions
npm run serve
\\\

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Permission Denied on Linux/macOS
\\\ash
# Make script executable
chmod +x deploy.sh

# If still having issues, run with bash explicitly
bash deploy.sh
\\\

#### 2. PowerShell Execution Policy Error
\\\powershell
# Allow scripts for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run once for current session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
\\\

#### 3. Firebase Authentication Issues
\\\ash
# Re-login to Firebase
firebase logout
firebase login

# Check current projects
firebase projects:list

# Switch to correct project
firebase use your-project-id
\\\

#### 4. Node.js Version Issues
\\\ash
# Check Node.js version (must be 18+)
node --version

# Update Node.js if needed
# Linux/macOS with nvm:
nvm install --lts
nvm use --lts

# Windows: Download from nodejs.org
\\\

#### 5. Dependency Installation Issues
\\\ash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf functions/node_modules # Linux/macOS
rmdir /s /q functions\\node_modules # Windows CMD
Remove-Item -Recurse -Force functions\\node_modules # Windows PowerShell

# Reinstall dependencies
cd functions
npm install
cd ..
\\\

#### 6. Git Issues
\\\ash
# Configure Git if not done
git config --global user.name \Your Name\
git config --global user.email \your.email@example.com\

# Check Git status
git status

# Commit changes before deployment
git add .
git commit -m \Update deployment configuration\
\\\

### Getting Help
\\\ash
# Show script help
# Linux/macOS:
./deploy.sh --help

# Windows Command Prompt:
deploy.bat /?

# Windows PowerShell:
.\\deploy.ps1 -Help

# Firebase CLI help
firebase --help
firebase deploy --help
\\\

### Viewing Logs
\\\ash
# View Firebase function logs
firebase functions:log

# View logs for specific function
firebase functions:log --only sendContactEmail

# View recent logs
firebase functions:log --limit 50
\\\

---

## Quick Reference Commands

### Linux/macOS Quick Commands
\\\ash
# Full deployment
./deploy.sh

# Functions only
./deploy.sh functions

# Hosting only 
./deploy.sh hosting

# Fast redeployment (skip dependencies)
./deploy.sh --no-build
./deploy.sh functions --no-build
./deploy.sh hosting --no-build

# Help
./deploy.sh --help
\\\

### Windows Quick Commands
\\\atch
:: Command Prompt (Recommended)
:: Full deployment
deploy.bat

:: Functions only
deploy.bat functions

:: Hosting only
deploy.bat hosting

:: Fast redeployment (skip dependencies)
deploy.bat -NoBuild
deploy.bat functions -NoBuild
deploy.bat hosting -NoBuild

:: Help
deploy.bat /?
\\\

\\\powershell
# PowerShell (Alternative)
# Full deployment
.\\deploy.ps1

# Functions only
.\\deploy.ps1 -FunctionsOnly

# Hosting only
.\\deploy.ps1 -HostingOnly

# Fast redeployment (skip dependencies)
.\\deploy.ps1 -NoBuild
.\\deploy.ps1 -FunctionsOnly -NoBuild
.\\deploy.ps1 -HostingOnly -NoBuild

# Help
.\\deploy.ps1 -Help
\\\

---

## Deployment Time Estimates

| Scenario | First Time | Redeployment | Fast Redeployment |
|----------|------------|--------------|------------------|
| Full deployment | 3-5 minutes | 2-3 minutes | 30-60 seconds |
| Functions only | 2-3 minutes | 1-2 minutes | 20-30 seconds |
| Hosting only | 1-2 minutes | 30-60 seconds | 10-20 seconds |

**Fast redeployment** = Using \-NoBuild\ or \--no-build\ flags

---

## Best Practices

1. **Always test locally** before deployment
2. **Use functions-only deployment** for email logic changes
3. **Use hosting-only deployment** for website content changes
4. **Use \-NoBuild\ flag** when dependencies havent changed
5. **Keep .env file secure** and never commit it
6. **Regular security audits** with \
pm audit\
7. **Monitor function logs** after deployment
8. **Use meaningful commit messages** for version tracking

---

**Happy Deploying! Your portfolio will be live in minutes!**
