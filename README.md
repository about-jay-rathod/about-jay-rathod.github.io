# 🚀 Jay Rathod - Portfolio Website

A modern, secure, and interactive portfolio website built with Firebase Functions, featuring AI-powered chatbot and dynamic contact system.

[![Firebase](https://img.shields.io/badge/Firebase-Functions-orange)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-Hardened-blue)](#security)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)  
- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🔒 Security](#-security)
- [🛠️ Development](#️-development)
- [📦 Deployment](#-deployment)
- [📄 License](#-license)

## ✨ Features

### 🤖 **AI-Powered Chatbot**
- **Gemini AI Integration**: Intelligent responses about Jay's experience and skills
- **Context-Aware**: Understands portfolio context and provides relevant information
- **Rate Limited**: 10 requests per 15 minutes for optimal performance

### 📧 **Dynamic Contact System**
- **Email Integration**: Direct delivery to Jay's inbox
- **Smart Validation**: Comprehensive input sanitization and validation
- **Rate Protected**: 3 submissions per hour to prevent spam

### 🛡️ **Enterprise Security**
- **Multi-Layer Protection**: CORS, rate limiting, input validation
- **Environment Isolation**: Separate configs for dev/staging/production
- **Secret Management**: No sensitive data in public repository

### 🎨 **Modern UI/UX**
- **Responsive Design**: Bootstrap-based responsive layout
- **Smooth Animations**: Professional interaction feedback
- **Loading States**: Real-time status indicators

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│  URL Rewrites   │───▶│ Firebase        │
│   (Static)      │    │  (firebase.json)│    │ Functions       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │               /api/chatbot              ┌─────▼─────┐
        │               /api/sendContactEmail     │   Gemini  │
        │                       │                │    AI     │
        ▼                       ▼                └───────────┘
┌─────────────────┐    ┌─────────────────┐              │
│   User's        │    │   Security      │              ▼
│   Browser       │    │   Middleware    │    ┌─────────────────┐
└─────────────────┘    └─────────────────┘    │   Gmail         │
                               │               │   SMTP          │
                               ▼               └─────────────────┘
                    ┌─────────────────┐
                    │  Rate Limiting  │
                    │  CORS Validation│  
                    │  Input Sanitation│
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Firebase CLI** ([Install Guide](https://firebase.google.com/docs/cli))
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone & Setup
```bash
# Clone the repository
git clone https://github.com/about-jay-rathod/about-jay-rathod.github.io.git
cd about-jay-rathod.github.io

# Install dependencies
npm install

# Install function dependencies
cd functions && npm install && cd ..
```

### 2️⃣ Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# - Add your Gemini API key
# - Configure Gmail app password
# - Set Firebase project details
```

### 3️⃣ Local Development
```bash
# Start Firebase emulators
firebase emulators:start

# Website available at: http://localhost:5000
# Emulator UI at: http://localhost:4000
```

## 📖 Documentation

Comprehensive documentation is available in the [`Documentation/`](Documentation/) folder:

| Document | Description |
|----------|-------------|
| [ **API.md**](Documentation/API.md) | API endpoints and usage examples |
| [🚀 **DEPLOYMENT.md**](Documentation/DEPLOYMENT.md) | Production deployment guide |
| [🛠️ **DEVELOPMENT.md**](Documentation/DEVELOPMENT.md) | Local development setup |
| [🔒 **SECURITY.md**](Documentation/SECURITY.md) | Security measures and best practices |
| [✅ **SECURITY-VALIDATION-REPORT.md**](Documentation/SECURITY-VALIDATION-REPORT.md) | Complete security audit results |

## 🔒 Security

This project implements **enterprise-grade security**:

### 🛡️ **Protection Layers**
- ✅ **URL Rewrites**: Hide internal Firebase function URLs
- ✅ **Rate Limiting**: Prevent API abuse (10 chatbot, 3 contact per timeframe)
- ✅ **CORS Validation**: Restrict cross-origin requests  
- ✅ **Input Sanitization**: Clean and validate all user inputs
- ✅ **Environment Isolation**: No secrets in public code

### 🔐 **Data Protection**
- ✅ **No Hardcoded Secrets**: All credentials in environment variables
- ✅ **Request Origin Validation**: Verify requests come from legitimate sources
- ✅ **Error Information Filtering**: Prevent information leakage

### 🚨 **Security Validation**
A complete security audit has been performed. See [Security Validation Report](Documentation/SECURITY-VALIDATION-REPORT.md) for details.

## 🛠️ Development

### Local Development Workflow

1. **Setup Environment**: Configure `.env` with your credentials
2. **Start Emulators**: `firebase emulators:start` 
3. **Open Browser**: Navigate to `http://localhost:5000`
4. **Test Features**: Use built-in development tools

### Development Tools

```bash
# Run security check
npm run security-check

# Test Firebase functions directly  
npm run test:functions

# Lint code
npm run lint

# Build for production
npm run build
```

### Environment Detection

The application automatically detects and configures for:
- 🔧 **Local Development** (`localhost`) - Firebase emulators
- 🚀 **Production** (`*.web.app`) - Firebase hosting
- 📄 **Static** (`github.io`) - GitHub Pages (limited features)

## 📦 Deployment

### Firebase Hosting (Recommended)
```bash
# Deploy to Firebase (full features)
firebase deploy

# Deploy functions only
firebase deploy --only functions

# Deploy hosting only  
firebase deploy --only hosting
```

### GitHub Pages (Static)
```bash
# Push to main branch (automatic deployment)
git push origin main

# Static site available at: https://about-jay-rathod.github.io
# Note: Chatbot and contact form disabled (no backend)
```

### Manual Deployment
See [Deployment Guide](Documentation/DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
about-jay-rathod.github.io/
├── 📁 Documentation/          # All project documentation  
├── 📁 Deployment/            # Deployment scripts and configs
├── 📁 functions/             # Firebase Cloud Functions
│   ├── 📁 src/              # Function source code
│   ├── 📁 test/             # Function tests
│   └── package.json         # Function dependencies
├── 📁 public/               # Frontend static files
│   ├── 📁 assets/          # CSS, JS, images
│   ├── 📁 projects/        # Project showcase pages
│   └── index.html          # Main portfolio page
├── 📄 .env.example         # Environment template
├── 📄 .gitignore          # Security-focused git ignore
├── 📄 firebase.json       # Firebase configuration
└── 📄 package.json        # Root dependencies
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Connect with Jay

- **Portfolio**: [about-jay-rathod.github.io](https://about-jay-rathod.github.io)
- **LinkedIn**: [Jay Rathod](https://linkedin.com/in/jay-rathod)
- **Email**: [jayrathod.ca@gmail.com](mailto:jayrathod.ca@gmail.com)

---

<div align="center">

**Built with ❤️ by Jay Rathod**

*Secured with 🛡️ enterprise-grade protection*

</div>
