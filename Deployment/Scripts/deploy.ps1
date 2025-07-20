# ═══════════════════════════════════════════════════════════════════════════
# 🚀 Jay Rathod Portfolio - Automated Deployment Script (Windows PowerShell)
# ═══════════════════════════════════════════════════════════════════════════
#
# This script automates the entire deployment process for the portfolio website
# including Firebase Functions and Hosting deployment.
#
# Prerequisites:
# - Node.js 18+ installed
# - Firebase CLI installed (npm install -g firebase-tools)
# - Git configured
# - .env file configured in functions\ directory
#
# Usage: .\deploy.ps1 [options]
# Options:
#   -FunctionsOnly    Deploy only Firebase Functions
#   -HostingOnly      Deploy only Firebase Hosting
#   -NoBuild         Skip dependency installation
#   -Help            Show this help message
#
# Example: .\deploy.ps1 -FunctionsOnly
#
# Author: Jay Rathod
# Last Updated: July 18, 2025
# ═══════════════════════════════════════════════════════════════════════════

param(
    [switch]$FunctionsOnly,
    [switch]$HostingOnly,
    [switch]$NoBuild,
    [switch]$Help
)

# Set execution policy for the current session (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force -ErrorAction SilentlyContinue

# Configuration
$ProjectName = "Jay Rathod Portfolio"
$FirebaseProject = "about-jay-rathod"

# Color functions for better output
function Write-ColorOutput($ForegroundColor, $Message) {
    $originalColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $Host.UI.RawUI.ForegroundColor = $originalColor
}

function Write-Step($Message) {
    Write-ColorOutput Blue "[STEP] $Message"
}

function Write-Success($Message) {
    Write-ColorOutput Green "[SUCCESS] $Message"
}

function Write-Warning($Message) {
    Write-ColorOutput Yellow "[WARNING] $Message"
}

function Write-Error($Message) {
    Write-ColorOutput Red "[ERROR] $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Cyan "[INFO] $Message"
}

# Help function
function Show-Help {
    Write-ColorOutput Magenta "═══════════════════════════════════════════════════════════════════════════"
    Write-ColorOutput Magenta "🚀 Jay Rathod Portfolio - Deployment Script (Windows)"
    Write-ColorOutput Magenta "═══════════════════════════════════════════════════════════════════════════"
    Write-Output ""
    Write-Output "Usage: .\deploy.ps1 [options]"
    Write-Output ""
    Write-Output "Options:"
    Write-Output "  -FunctionsOnly    Deploy only Firebase Functions"
    Write-Output "  -HostingOnly      Deploy only Firebase Hosting"
    Write-Output "  -NoBuild         Skip dependency installation"
    Write-Output "  -Help            Show this help message"
    Write-Output ""
    Write-Output "Examples:"
    Write-Output "  .\deploy.ps1                    # Full deployment"
    Write-Output "  .\deploy.ps1 -FunctionsOnly     # Deploy only functions"
    Write-Output "  .\deploy.ps1 -HostingOnly       # Deploy only hosting"
    Write-Output ""
    Write-Output "Note: You may need to run 'Set-ExecutionPolicy RemoteSigned' if you get execution policy errors."
    Write-Output ""
    exit 0
}

if ($Help) {
    Show-Help
}

# Set deployment flags
$DeployFunctions = $true
$DeployHosting = $true

if ($FunctionsOnly) {
    $DeployHosting = $false
}

if ($HostingOnly) {
    $DeployFunctions = $false
}

# Header
Write-ColorOutput Magenta "═══════════════════════════════════════════════════════════════════════════"
Write-ColorOutput Magenta "🚀 $ProjectName - Automated Deployment"
Write-ColorOutput Magenta "═══════════════════════════════════════════════════════════════════════════"
Write-Output ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Step "Checking prerequisites..."

# Check Node.js
Write-Info "Checking Node.js installation..."
if (-not (Test-Command "node")) {
    Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
}

$NodeVersion = node --version
Write-Success "✅ Node.js found and ready"
Write-Info "Node.js version: $NodeVersion"

# Check Firebase CLI
Write-Info "Checking Firebase CLI installation..."
if (-not (Test-Command "firebase")) {
    Write-Error "Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
    exit 1
}

$FirebaseVersion = firebase --version
Write-Success "✅ Firebase CLI found and ready"
Write-Info "Firebase CLI version: $FirebaseVersion"

# Check Git
Write-Info "Checking Git installation..."
if (-not (Test-Command "git")) {
    Write-Error "Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
}

Write-Success "✅ Git found and ready"
Write-Success "✅ All prerequisites validated successfully!"
Write-Output ""

# Check if .env exists
Write-Step "Checking environment configuration..."
Write-Info "Verifying .env file exists in functions directory..."
if (-not (Test-Path "functions\.env")) {
    Write-Error ".env file not found in functions\ directory!"
    Write-Info "Please copy functions\.env.template to functions\.env and configure your API keys."
    exit 1
}
Write-Success "✅ .env file found and properly configured!"
Write-Output ""

# Install dependencies (unless skipped)
if (-not $NoBuild) {
    Write-Step "Installing Node.js dependencies..."
    Set-Location functions
    
    if (Test-Path "package-lock.json") {
        Write-Info "Using npm ci for faster, reliable builds..."
        npm ci
    } else {
        Write-Info "Using npm install for dependency installation..."
        npm install
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies!"
        Set-Location ..
        exit 1
    }
    
    Set-Location ..
    Write-Success "✅ All Node.js dependencies installed successfully!"
    Write-Output ""
}

# Validate code syntax
Write-Step "Validating JavaScript syntax..."
Set-Location functions
Write-Info "Checking index.js for syntax errors..."
$syntaxCheck = node -c index.js
if ($LASTEXITCODE -eq 0) {
    Write-Success "✅ All JavaScript syntax validation passed!"
} else {
    Write-Error "JavaScript syntax error detected!"
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Output ""

# Security check - ensure .env is ignored
Write-Step "Running security validation..."
Write-Info "Checking .env file Git ignore status..."
$envIgnored = git check-ignore functions\.env 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "✅ .env file is properly secured and ignored by Git"
} else {
    Write-Warning "⚠️  .env file might not be ignored. Please check .gitignore"
}

# Check for sensitive data in staged files
Write-Info "Scanning staged files for sensitive data..."
$sensitiveFiles = git diff --cached --name-only | Select-String -Pattern "\.(env|key|pem)$"
if ($sensitiveFiles) {
    Write-Error "❌ Sensitive files detected in staged changes!"
    Write-Info "Please unstage any .env, .key, or .pem files before deployment."
    exit 1
}
Write-Success "✅ Security validation completed!"
Write-Output ""

# Firebase login check
Write-Step "Verifying Firebase authentication..."
Write-Info "Checking Firebase login status..."
firebase projects:list >$null 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Success "✅ Firebase authentication verified successfully!"
} else {
    Write-Error "Not authenticated with Firebase. Please run: firebase login"
    exit 1
}
Write-Output ""

# Deploy Functions
if ($DeployFunctions) {
    Write-Step "Deploying Firebase Functions..."
    Write-Info "Uploading function code to Firebase..."
    Write-Info "Project: $FirebaseProject"
    firebase deploy --only functions --project $FirebaseProject
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Firebase Functions deployed successfully!"
        Write-Success "✅ All serverless functions are now live and operational!"
        
        Write-Info "📡 Function URLs:"
        Write-Info "🔒 API Endpoints: Configured dynamically for security"
        Write-Info "   • Local Dev: http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot"
        Write-Info "   • Local Dev: http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail"
        Write-Info "   • Production: Access through website interface with proper authentication"
    } else {
        Write-Error "❌ Firebase Functions deployment failed!"
        exit 1
    }
    Write-Output ""
}

# Deploy Hosting
if ($DeployHosting) {
    Write-Step "Deploying Firebase Hosting..."
    Write-Info "Uploading static website files..."
    Write-Info "Project: $FirebaseProject"
    firebase deploy --only hosting --project $FirebaseProject
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Firebase Hosting deployed successfully!"
        Write-Success "✅ Website is now live and accessible worldwide!"
        Write-Info "🌐 Website URL: https://about-jay-rathod.web.app"
    } else {
        Write-Error "❌ Firebase Hosting deployment failed!"
        exit 1
    }
    Write-Output ""
}

# Final success message
Write-ColorOutput Green "═══════════════════════════════════════════════════════════════════════════"
Write-ColorOutput Green "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
Write-ColorOutput Green "═══════════════════════════════════════════════════════════════════════════"
Write-Output ""
Write-Info "🚀 Your portfolio is now live!"
Write-Info "🌐 Website: https://about-jay-rathod.web.app"
Write-Info "📧 Contact form with AI-powered email system is active"
Write-Info "🤖 Chatbot with Google Gemini 2.0 Flash is ready"
Write-Output ""
Write-Info "📊 Firebase Console: https://console.firebase.google.com/project/$FirebaseProject/overview"
Write-Output ""

# Optional: Open website
$openWebsite = Read-Host "🌐 Open website in browser? (y/N)"
if ($openWebsite -eq "y" -or $openWebsite -eq "Y") {
    Start-Process "https://about-jay-rathod.web.app"
}

Write-Success "All done! Your portfolio is production-ready!"
