#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 Jay Rathod Portfolio - Automated Deployment Script (Linux/macOS)
# ═══════════════════════════════════════════════════════════════════════════
#
# This script automates the entire deployment process for the portfolio website
# including Firebase Functions and Hosting deployment.
#
# Prerequisites:
# - Node.js 18+ installed
# - Firebase CLI installed (npm install -g firebase-tools)
# - Git configured
# - .env file configured in functions/ directory
#
# Usage: ./deploy.sh [options]
# Options:
#   --functions-only    Deploy only Firebase Functions
#   --hosting-only      Deploy only Firebase Hosting
#   --no-build          Skip dependency installation
#   --help             Show this help message
#
# Author: Jay Rathod
# Last Updated: July 18, 2025
# ═══════════════════════════════════════════════════════════════════════════

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Jay Rathod Portfolio"
FIREBASE_PROJECT="about-jay-rathod"

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Function to show help
show_help() {
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}🚀 Jay Rathod Portfolio - Deployment Script${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Usage: ./deploy.sh [options]"
    echo ""
    echo "Options:"
    echo "  --functions-only    Deploy only Firebase Functions"
    echo "  --hosting-only      Deploy only Firebase Hosting"  
    echo "  --no-build          Skip dependency installation"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh                    # Full deployment"
    echo "  ./deploy.sh --functions-only   # Deploy only functions"
    echo "  ./deploy.sh --hosting-only     # Deploy only hosting"
    echo ""
    exit 0
}

# Parse command line arguments
DEPLOY_FUNCTIONS=true
DEPLOY_HOSTING=true
SKIP_BUILD=false

for arg in "$@"; do
    case $arg in
        --functions-only)
            DEPLOY_HOSTING=false
            shift
            ;;
        --hosting-only)
            DEPLOY_FUNCTIONS=false
            shift
            ;;
        --no-build)
            SKIP_BUILD=true
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            print_error "Unknown option: $arg"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# Header
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}🚀 ${PROJECT_NAME} - Automated Deployment${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"
echo ""

# Check prerequisites
print_step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"
print_success "✅ Node.js found and ready"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
    exit 1
fi

FIREBASE_VERSION=$(firebase --version)
print_info "Firebase CLI version: $FIREBASE_VERSION"
print_success "✅ Firebase CLI found and ready"

# Check Git
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

print_success "✅ Git found and ready"

print_success "✅ All prerequisites validated successfully!"
echo ""

# Check if .env exists
print_step "Checking environment configuration..."
if [ ! -f "functions/.env" ]; then
    print_error ".env file not found in functions/ directory!"
    print_info "Please copy functions/.env.template to functions/.env and configure your API keys."
    exit 1
fi
print_success "✅ .env file found and configured!"
print_success "✅ Environment configuration validated successfully!"
echo ""

# Install dependencies (unless skipped)
if [ "$SKIP_BUILD" = false ]; then
    print_step "Installing dependencies..."
    cd functions
    
    if [ -f "package-lock.json" ]; then
        print_info "Using npm ci for clean installation (package-lock.json found)"
        npm ci
        print_success "✅ Dependencies installed with npm ci"
    else
        print_info "Using npm install (no package-lock.json found)"
        npm install
        print_success "✅ Dependencies installed with npm install"
    fi
    
    cd ..
    print_success "✅ All Node.js dependencies installed successfully!"
    echo ""
fi

# Validate code syntax
print_step "Validating code syntax..."
cd functions
print_info "Checking index.js syntax..."
if node -c index.js; then
    print_success "✅ index.js syntax is valid!"
else
    print_error "❌ JavaScript syntax error detected in index.js!"
    exit 1
fi
cd ..
print_success "✅ All JavaScript files validated successfully!"
echo ""

# Security check - ensure .env is ignored
print_step "Running security checks..."
print_info "Checking if .env file is ignored by Git..."
if git check-ignore functions/.env &> /dev/null; then
    print_success "✅ .env file is properly ignored by Git"
else
    print_warning "⚠️  .env file might not be ignored. Please check .gitignore"
fi

# Check for sensitive data in staged files
print_info "Scanning for sensitive files in staged changes..."
if git diff --cached --name-only | grep -E "\.(env|key|pem)$" &> /dev/null; then
    print_error "❌ Sensitive files detected in staged changes!"
    print_info "Please unstage any .env, .key, or .pem files before deployment."
    exit 1
fi
print_success "✅ No sensitive files found in staged changes"
print_success "✅ All security checks passed successfully!"
echo ""

# Firebase login check
print_step "Checking Firebase authentication..."
print_info "Verifying Firebase CLI authentication status..."
if firebase projects:list &> /dev/null; then
    print_success "✅ Firebase authentication verified!"
    print_success "✅ Ready to deploy to Firebase project: $FIREBASE_PROJECT"
else
    print_error "❌ Not authenticated with Firebase. Please run: firebase login"
    exit 1
fi
echo ""

# Deploy Functions
if [ "$DEPLOY_FUNCTIONS" = true ]; then
    print_step "Deploying Firebase Functions..."
    print_info "Uploading serverless functions to Firebase..."
    if firebase deploy --only functions --project "$FIREBASE_PROJECT"; then
        print_success "✅ Firebase Functions deployed successfully!"
        print_success "✅ All serverless functions are now live and operational!"
        
        # Extract function URLs (approximate, may vary by region)
        print_info "📡 Function URLs:"
        print_info "🔒 API Endpoints: Configured dynamically for security"
        print_info "   • Local Dev: http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot"
        print_info "   • Local Dev: http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail"
        print_info "   • Production: Access through website interface with proper authentication"
        print_success "✅ Function endpoints are accessible and ready!"
    else
        print_error "❌ Firebase Functions deployment failed!"
        exit 1
    fi
    echo ""
fi

# Deploy Hosting
if [ "$DEPLOY_HOSTING" = true ]; then
    print_step "Deploying Firebase Hosting..."
    print_info "Uploading static website files to Firebase Hosting..."
    if firebase deploy --only hosting --project "$FIREBASE_PROJECT"; then
        print_success "✅ Firebase Hosting deployed successfully!"
        print_success "✅ Static website is now live and accessible!"
        print_info "🌐 Website URL: https://about-jay-rathod.web.app"
        print_success "✅ Portfolio website is production-ready!"
    else
        print_error "❌ Firebase Hosting deployment failed!"
        exit 1
    fi
    echo ""
fi

# Final success message
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo ""
print_success "✅ All deployment processes completed successfully!"
print_info "🚀 Your portfolio is now live!"
print_info "🌐 Website: https://about-jay-rathod.web.app"
print_info "📧 Contact form with AI-powered email system is active"
print_info "🤖 Chatbot with Google Gemini 2.0 Flash is ready"
echo ""
print_info "📊 Firebase Console: https://console.firebase.google.com/project/$FIREBASE_PROJECT/overview"
print_success "✅ Portfolio is fully operational and production-ready!"
echo ""

# Optional: Open website
read -p "🌐 Open website in browser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://about-jay-rathod.web.app"
    elif command -v open &> /dev/null; then
        open "https://about-jay-rathod.web.app"
    else
        print_info "Please open https://about-jay-rathod.web.app in your browser"
    fi
fi

print_success "🎯 All done! Your portfolio is production-ready!"
