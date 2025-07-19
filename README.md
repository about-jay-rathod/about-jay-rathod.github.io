# 🚀 Jay Rathod Portfolio Website

[![Firebase](https://img.shields.io/badge/Firebase-Functions-orange)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini%202.0%20Flash-blue)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

A **production-ready**, modern portfolio website featuring AI-powered chatbot interactions and professional contact management. Built with modular architecture, comprehensive testing, and enterprise-grade security practices.

## 🌟 Key Features

### ✨ Core Functionality
- **🎨 Responsive Portfolio** - Modern Bootstrap 4 design with mobile-first approach
- **🤖 AI-Powered Chatbot** - Context-aware assistant using Google Gemini 2.0 Flash
- **📧 Smart Contact System** - Dual-email workflow with AI auto-responses
- **🔐 Enterprise Security** - Server-side API protection with comprehensive validation
- **📊 Professional Templates** - Beautiful HTML email templates with responsive design

### 🛡️ Production Security
- **Environment-based Configuration** - All sensitive data in environment variables
- **Input Validation & Sanitization** - Comprehensive security validation
- **CORS Protection** - Properly configured cross-origin resource sharing
- **Error Boundary Protection** - Graceful error handling and logging
- **Rate Limiting** - Protection against abuse and spam

### 🚀 Developer Experience
- **Modular Architecture** - Clean separation of concerns with service classes
- **Comprehensive Testing** - Unit and integration tests with Jest
- **Code Quality Tools** - ESLint, Prettier for consistent code standards
- **Documentation** - Complete API docs and developer guides
- **Automated Deployment** - Production-ready deployment scripts

## 🏗️ Architecture Overview

```
📁 Jay Rathod Portfolio
├── 📁 public/                    # Frontend Static Files
│   ├── 📁 assets/               # CSS, JS, Images, Vendor Libraries
│   ├── 📁 projects/             # Individual Project Pages
│   └── index.html               # Main Portfolio Page
├── 📁 functions/                # Backend Firebase Functions
│   ├── 📁 src/                  # Source Code (Modular Architecture)
│   │   ├── 📁 services/         # Business Logic (EmailService, AIService)
│   │   ├── 📁 utils/            # Utilities (Validation, Error Handling)
│   │   └── index.js             # Main Functions Entry Point
│   ├── 📁 test/                 # Comprehensive Test Suite
│   ├── 📁 scripts/              # Development & Deployment Scripts
│   ├── 📁 docs/                 # API Documentation
│   └── package.json             # Dependencies & Scripts
├── 📁 Documentation/            # All Project Documentation
│   ├── FUNCTIONS_README.md      # Firebase Functions Guide
│   ├── API_DOCUMENTATION.md     # Complete API Reference
│   ├── DEPLOYMENT_GUIDE.md      # Deployment Instructions
│   ├── DEPENDENCIES.md          # Dependencies Guide
│   └── ... (Other Documentation)
├── 📁 Deployment/               # Deployment Resources
│   └── 📁 Scripts/              # Platform-specific Deployment Scripts
│       ├── deploy.sh            # Linux/macOS Script
│       ├── deploy.ps1           # Windows PowerShell Script
│       └── deploy.bat           # Windows Command Prompt Script
├── firebase.json                # Firebase Configuration
├── package.json                 # Root Package Configuration
└── README.md                    # This File
```

## 🔧 Technology Stack

### Frontend Technologies
- **HTML5/CSS3** - Semantic markup and modern styling
- **Bootstrap 4** - Responsive framework and components
- **JavaScript ES6+** - Modern vanilla JavaScript features
- **jQuery** - DOM manipulation and smooth animations

### Backend Technologies
- **Node.js 20** - Latest LTS runtime environment
- **Firebase Functions** - Serverless cloud functions
- **Google Gemini 2.0 Flash** - Advanced AI language model
- **Nodemailer** - Professional email delivery service

### Development & Testing
- **Jest** - Comprehensive testing framework
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and consistency
- **Firebase Emulator** - Local development environment
### Third-Party Libraries
- **Owl Carousel** - Image galleries and testimonials
- **Isotope** - Portfolio filtering and sorting
- **Venobox** - Responsive lightbox functionality
- **Counter Up** - Animated number counters
- **Waypoints** - Scroll-triggered animations
- **Typed.js** - Typewriter text animations

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Firebase CLI** - Install with `npm install -g firebase-tools`
- **Gmail Account** - With App Password enabled
- **Google Gemini API Key** - From [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/about-jay-rathod/about-jay-rathod.github.io.git
cd about-jay-rathod.github.io

# Install dependencies for both root and functions
npm install
cd functions && npm install && cd ..

# Login to Firebase
firebase login
```

### 2. Environment Configuration
Create your environment file:
```bash
# Copy the template and edit with your credentials
cd functions
cp .env.template .env
# Edit .env with your API keys and configuration
```

Required environment variables:
```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration  
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=your_email@gmail.com
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### 3. Development Setup
```bash
# Start local development server
npm run dev

# Or run individual services
npm run serve          # Start Firebase emulator
npm run build          # Build for production
npm run test           # Run test suite
```

### 4. Production Deployment
```bash
# Verify deployment readiness
npm run verify-deployment

# Deploy to Firebase
npm run deploy         # Full deployment
npm run deploy:functions # Functions only
npm run deploy:hosting   # Hosting only
```

## 📚 Documentation

All comprehensive documentation has been organized in the `/Documentation` folder:

- **[Functions Guide](./Documentation/FUNCTIONS_README.md)** - Firebase Functions detailed documentation
- **[API Reference](./Documentation/API_DOCUMENTATION.md)** - Complete API endpoints documentation  
- **[Deployment Guide](./Documentation/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Dependencies Guide](./Documentation/DEPENDENCIES.md)** - Package management and dependencies
- **[Commands Reference](./Documentation/COMMANDS_REFERENCE.md)** - All available npm scripts
- **[Project Summary](./Documentation/PROJECT_SUMMARY.md)** - High-level project overview
- **[Repository Structure](./Documentation/REPOSITORY_STRUCTURE.md)** - Detailed file structure

## 🚀 Deployment Resources

Platform-specific deployment scripts and guides are organized in the `/Deployment` folder:

- **[Deployment Overview](./Deployment/README.md)** - Deployment methods and quick start
- **[Deployment Scripts](./Deployment/Scripts/README.md)** - Automated scripts for all platforms
- **[Linux/macOS Script](./Deployment/Scripts/deploy.sh)** - Shell script for Unix systems
- **[Windows PowerShell Script](./Deployment/Scripts/deploy.ps1)** - PowerShell automation
- **[Windows Batch Script](./Deployment/Scripts/deploy.bat)** - Command Prompt deployment

## 🧪 Testing & Quality Assurance

### Test Coverage
- **Unit Tests** - Service classes and utility functions
- **Integration Tests** - End-to-end function testing
- **Validation Tests** - Input validation and error handling
- **Security Tests** - Authentication and authorization

### Code Quality
```bash
# Run full test suite
npm run test

# Code linting
npm run lint

# Code formatting
npm run format

# Security audit
npm run audit

# Production readiness check
npm run verify-deployment
```

## 🌐 Live Demo & Endpoints

- **🏠 Portfolio Website**: [https://about-jay-rathod.web.app](https://about-jay-rathod.web.app)
- **🤖 Chatbot API**: `https://chatbot-r64livvx2q-uc.a.run.app`
- **📧 Contact API**: `https://sendcontactemail-r64livvx2q-uc.a.run.app`

## �️ Development Commands

```bash
# Development
npm run dev              # Start development environment
npm run serve            # Start Firebase emulator
npm run build            # Build for production

# Testing & Quality
npm run test             # Run test suite
npm run test:watch       # Run tests in watch mode
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier

# Deployment
npm run verify-deployment # Check production readiness
npm run deploy           # Full deployment
npm run deploy:functions # Deploy functions only
npm run deploy:hosting   # Deploy hosting only

# Monitoring
npm run logs             # View function logs
firebase functions:log   # Detailed Firebase logs
```

## 🔧 Configuration

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use this password in your `.env` file as `EMAIL_PASS`

### Google Gemini API Setup
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style (ESLint + Prettier configured)
- Add tests for new features
- Update documentation as needed
- Ensure all quality checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## �‍💻 About the Developer

**Jay Rathod** - Full Stack Developer & AI Enthusiast
- 🌐 **Portfolio**: [https://about-jay-rathod.web.app](https://about-jay-rathod.web.app)
- 📧 **Email**: [jayrathod.ca@gmail.com](mailto:jayrathod.ca@gmail.com)
- 💼 **LinkedIn**: [https://linkedin.com/in/jayrathod](https://linkedin.com/in/jayrathod)
- 🐙 **GitHub**: [https://github.com/about-jay-rathod](https://github.com/about-jay-rathod)

## ⭐ Support

If you find this project helpful, please consider giving it a ⭐ star on GitHub!

---

> **Production Status**: ✅ **READY** - This project is production-ready with comprehensive testing, security measures, and documentation.

*Last Updated: July 19, 2025 | Version: 2.1.0*
./deploy.sh --no-build              # Linux/macOS
.\deploy.ps1 -NoBuild               # Windows PowerShell
```

#### **Smart Redeployment Features:**
- 🔍 **Change Detection** - Only deploys what you've modified
- ⚡ **Speed Optimization** - Skip dependencies when unchanged
- 🛡️ **Pre-deployment Validation** - Prevents broken deployments
- 📊 **Status Reporting** - Shows exactly what was updated
- 🔗 **Live URL Updates** - Displays new function endpoints

### **🔧 Manual Deployment (Alternative)**

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Website
```bash
firebase deploy --only hosting
```

### Deploy Only Functions
```bash
firebase deploy --only functions
```

## � **Making Changes & Redeployment**

### **📝 Common Change Scenarios**

#### **1. Email Template Updates**
```bash
# 1. Edit email templates in functions/index.js
# 2. Deploy only functions (fast):

# Linux/macOS
./deploy.sh functions --no-build

# Windows Command Prompt
deploy.bat functions -NoBuild

# Windows PowerShell
.\deploy.ps1 -FunctionsOnly -NoBuild
```

#### **2. Website Content Updates**
```bash
# 1. Edit files in public/ directory:
#    - public/index.html (main content)
#    - public/assets/css/style.css (styling)
#    - public/assets/img/ (images)

# 2. Deploy only hosting (very fast):

# Linux/macOS
./deploy.sh hosting --no-build

# Windows Command Prompt
deploy.bat hosting -NoBuild

# Windows PowerShell
.\deploy.ps1 -HostingOnly -NoBuild
```

#### **3. Adding New Portfolio Projects**
```bash
# 1. Create new project file: public/projects/newproject.html
# 2. Add project image: public/assets/img/project/newproject.jpg
# 3. Update portfolio section in public/index.html
# 4. Deploy hosting only:

# Linux/macOS
./deploy.sh hosting

# Windows Command Prompt
deploy.bat hosting

# Windows PowerShell
.\deploy.ps1 -HostingOnly
```

#### **4. AI Chatbot Logic Updates**
```bash
# 1. Edit chatbot function in functions/index.js
# 2. Test locally (optional):
cd functions
node -c index.js  # Validate syntax
cd ..

# 3. Deploy functions only:

# Linux/macOS
./deploy.sh functions

# Windows Command Prompt
deploy.bat functions

# Windows PowerShell
.\deploy.ps1 -FunctionsOnly
```

#### **5. Environment Variables Changes**
```bash
# 1. Edit functions/.env file with new API keys or credentials
# 2. Deploy functions only (environment changes require restart):

# Linux/macOS
./deploy.sh functions

# Windows Command Prompt
deploy.bat functions

# Windows PowerShell
.\deploy.ps1 -FunctionsOnly
```

### **⚡ Speed Optimization Tips**
- **Use `-NoBuild` or `--no-build`** when dependencies haven't changed
- **Deploy functions only** for email/AI logic changes
- **Deploy hosting only** for website content changes
- **Use full deployment** only when both website and functions changed

### **🔧 Development Workflow**
```bash
# 1. Make your changes
# 2. Test locally (optional but recommended)
firebase serve  # Test website locally
firebase emulators:start  # Test functions locally

# 3. Choose appropriate deployment:
#    - Changed email logic? → functions only
#    - Changed website content? → hosting only  
#    - Changed both? → full deployment
#    - Dependencies unchanged? → add -NoBuild flag

# 4. Deploy using scripts (recommended)
./deploy.sh [functions|hosting] [--no-build]  # Linux/macOS
deploy.bat [functions|hosting] [-NoBuild]     # Windows CMD
.\deploy.ps1 [-FunctionsOnly|-HostingOnly] [-NoBuild]  # Windows PS

# 5. Verify deployment
# Check the live URLs displayed after deployment
```

## �📧 **Enhanced Two-Way Email System**

### **How It Works**
1. **User submits contact form** → Triggers dual email system
2. **Email 1**: Notification sent TO Jay FROM user (for receiving inquiries)
3. **Email 2**: Auto-reply sent TO user FROM Jay (professional acknowledgment)
4. **AI-powered responses** personalized to each inquiry
5. **Beautiful HTML formatting** for both emails

### **Gmail App Password Setup**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate an App Password for "Mail"
4. Use this password in the `EMAIL_PASS` environment variable

### **Email Features**
- ✅ **Dual Email System**: Both Jay and user receive professional emails
- ✅ **AI-Generated Responses**: Personalized auto-replies using Gemini 2.0 Flash
- ✅ **Beautiful HTML Templates**: Professional design with CSS styling
- ✅ **Proper Headers**: Correct FROM/TO/Reply-To configuration
- ✅ **Contact Form Validation**: Server-side input validation
- ✅ **Error Handling**: Graceful fallbacks and detailed error reporting
- ✅ **Security**: All credentials server-side, no exposed API keys

### **Email Configuration**
```env
# Only these variables needed in functions/.env
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=jayrathod.ca@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**Note**: `EMAIL_TO` is no longer needed - we use `EMAIL_USER` for both sending and receiving.

## 🤖 AI Chatbot Features

### Capabilities
- Real-time responses using Google Gemini 2.0 Flash
- Professional data sourced from GitHub Gist
- Conversation history tracking
- Fallback handling for API failures
- Typing indicators and smooth animations

### Data Source
Professional information is managed through a GitHub Gist:
- **URL**: [Jay's Professional Data Gist](https://gist.githubusercontent.com/about-jay-rathod/418847605369c1a416e3d554f85d0fa3/raw/f3dd76ca8e62909a0a2d532b42356d3800e75e74/jay-portfolio-app-generative-ai-api-initial-prompt.txt)
- **Benefits**: Single source of truth, easy updates, version control

## 🔒 Security Implementation

### API Key Protection
```javascript
// ❌ WRONG - Exposed in client code
const apiKey = "AIzaSyC..."; // Never do this!

// ✅ CORRECT - Server-side only
const apiKey = process.env.GEMINI_API_KEY; // In Firebase Functions
```

### Environment Variables
All sensitive data is stored in `functions/.env`:
- Gemini API key
- Gmail app password
- SMTP credentials

### CORS Configuration
```javascript
res.set('Access-Control-Allow-Origin', '*');
res.set('Access-Control-Allow-Methods', 'GET, POST');
res.set('Access-Control-Allow-Headers', 'Content-Type');
```

## 📁 File Structure Explained

### Main Website Files
- `public/index.html` - Portfolio homepage with all sections
- `public/assets/js/main.js` - Core JavaScript functionality
- `public/assets/css/style.css` - Custom styles and animations

### Firebase Functions
- `functions/portfolio-firebase-functions.js` - AI chatbot and email functions
- `functions/.env` - Environment variables (never commit this!)
- `functions/package.json` - Node.js dependencies

### Project Pages
- `public/projects/ecom.html` - E-commerce project showcase
- `public/projects/ninf.html` - News platform project
- `public/projects/pdd.html` - Parkinson's detection project
- `public/projects/rob.html` - Robotics project

## 🛠️ Development Workflow

### Testing Locally
```bash
# Start Firebase emulators
firebase serve

# Test functions locally
firebase functions:shell
```

### Making Updates

1. **Website Changes**: Edit files in `public/` folder
2. **Function Changes**: Edit `functions/portfolio-firebase-functions.js`
3. **Deploy Changes**: Run `firebase deploy`

### Code Quality
- **ES6+ Syntax** - Modern JavaScript features
- **Error Handling** - Comprehensive try-catch blocks
- **Input Validation** - Form data sanitization
- **Documentation** - Inline comments and JSDoc

## 🎨 Customization

### Updating Professional Data
1. Edit the GitHub Gist content
2. Changes automatically reflect in chatbot responses
3. No redeployment needed

### Styling Changes
- `public/assets/css/style.css` - Custom styles
- Responsive design with Bootstrap classes
- CSS animations and transitions

### Adding Projects
1. Create new HTML file in `public/projects/`
2. Add project thumbnail to `public/assets/img/project/`
3. Update portfolio section in `index.html`

## 📊 Performance Features

### Optimizations
- Minified CSS/JS libraries
- Optimized images
- Lazy loading for portfolio items
- CDN delivery via Firebase Hosting

### Analytics Integration
Ready for Google Analytics integration:
```html
<!-- Add to index.html head section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🚨 Troubleshooting

### Common Issues

**Functions not working?**
- Check Firebase Blaze plan is active
- Verify environment variables in `.env`
- Check function logs: `firebase functions:log`

**Email not sending?**
- Verify Gmail app password
- Check SMTP settings
- Enable "Less secure app access" if needed

**Chatbot offline?**
- Check Gemini API key validity
- Verify Gist URL accessibility
- Check browser console for errors

### Debug Commands
```bash
# Check function status
firebase functions:log

# Test local deployment
firebase serve

# Check project configuration
firebase projects:list
```

## 📦 **Production-Ready Features**

### **Dependency Management**
- **Automated Updates**: Monthly dependency checks with `npm run check-updates`
- **Security Monitoring**: Regular vulnerability scanning with `npm audit`
- **Version Tracking**: Comprehensive dependency documentation in `DEPENDENCIES.md`
- **Update Scripts**: Easy maintenance with predefined npm scripts

### **Cost Management**
- **Live Pricing**: Check current Firebase pricing at [firebase.google.com/pricing](https://firebase.google.com/pricing)
- **Google AI Pricing**: Gemini API rates at [ai.google.dev/pricing](https://ai.google.dev/pricing)
- **Cost Monitoring**: Firebase Console → Usage and billing
- **Billing Alerts**: Set up budget notifications in Google Cloud Console
- **Current Usage**: Minimal cost (~$0-5/month for typical portfolio traffic)

### **Professional Email System**
- **HTML Templates**: Beautiful, responsive email formatting
- **Professional Headers**: Proper FROM/TO/Reply-To configuration
- **User Experience**: Contact forms send TO Jay FROM users
- **Delivery Tracking**: Gmail integration with delivery confirmations

### **Enterprise-Grade Documentation**
- **Comprehensive Setup**: Step-by-step deployment guides  
- **Commands Reference**: Complete npm & Firebase CLI documentation in `COMMANDS_REFERENCE.md`
- **Troubleshooting**: Common issues and solutions
- **Security Best Practices**: Environment variable protection
- **Maintenance Procedures**: Regular update and monitoring schedules

## 📚 **Repository Organization**

### **🏗️ Project Structure**
```
📁 about-jay-rathod.github.io/
├── 📄 Documentation (4 files)
│   ├── README.md               # Setup & deployment guide
│   ├── DEPENDENCIES.md         # Package management
│   ├── COMMANDS_REFERENCE.md   # CLI commands
│   └── REPOSITORY_STRUCTURE.md # Project organization
├── 🔧 Configuration (3 files)
│   ├── firebase.json           # Firebase settings
│   ├── .gitignore             # Security & exclusions
│   └── LICENSE                # MIT License
├── 📂 public/                 # Frontend (90+ files)
│   ├── index.html             # Main portfolio
│   ├── assets/ (CSS, JS, img) # Static resources
│   └── projects/              # Project showcases
└── 📂 functions/              # Backend (Node.js)
    ├── portfolio-firebase-functions.js  # Main Functions
    ├── package.json
    ├── .env.template          # Environment setup
    └── .env                   # Credentials (protected)
```

### **🔐 Security Features**
- ✅ **Comprehensive .gitignore** - Protects 50+ sensitive file types
- ✅ **Environment Variables** - All API keys server-side only
- ✅ **Template System** - Safe credential setup with `.env.template`
- ✅ **No Exposed Secrets** - Zero hardcoded keys or passwords
- ✅ **Production Ready** - Enterprise-grade security practices

### **📖 Complete Documentation**
- **README.md** - Main setup and deployment guide  
- **DEPENDENCIES.md** - Dependency management and version tracking
- **COMMANDS_REFERENCE.md** - Complete npm & Firebase CLI reference
- **REPOSITORY_STRUCTURE.md** - Project organization and contribution guide

### **Quick Reference Links**
- **Firebase Console**: [console.firebase.google.com/project/about-jay-rathod](https://console.firebase.google.com/project/about-jay-rathod)
- **Live Website**: [about-jay-rathod.web.app](https://about-jay-rathod.web.app)
- **Function Logs**: Firebase Console → Functions → Logs
- **Usage & Billing**: Firebase Console → Usage and billing

## 🔄 Update Process

### Regular Updates
1. **Content Updates**: Edit GitHub Gist for chatbot data
2. **Design Updates**: Modify CSS/JS in `public/assets/`
3. **Function Updates**: Edit `portfolio-firebase-functions.js`
4. **Deploy**: Run `firebase deploy`

### Version Control
```bash
# Commit changes
git add .
git commit -m "Update: description of changes"
git push origin firebase-production
```

## 📞 Contact Form Flow

1. **User Submission** → Form validation
2. **Firebase Function** → Process form data
3. **AI Response** → Generate personalized reply
4. **Email Send** → Professional HTML email to Jay
5. **User Feedback** → Success message with AI response

## 🤖 Chatbot Flow

1. **User Message** → Input validation
2. **Gist Fetch** → Get latest professional data
3. **AI Processing** → Generate contextual response
4. **Response Display** → Formatted chat bubble
5. **History Tracking** → Maintain conversation context

## 📈 Future Enhancements

### Potential Improvements
- [ ] Analytics dashboard
- [ ] Blog section with CMS
- [ ] Multi-language support
- [ ] Advanced AI features (image analysis)
- [ ] Social media integration
- [ ] SEO optimization tools

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

## 👨‍💻 Author

**Jay Rathod**
- Website: [jayrathod.ca](https://about-jay-rathod.web.app)
- Email: jayrathod.ca@gmail.com
- GitHub: [@about-jay-rathod](https://github.com/about-jay-rathod)

---

*Last Updated: July 18, 2025*
*Version: 2.1.0*

---

## 🚀 Quick Start Commands

```bash
# Deploy website only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy

# View logs
firebase functions:log

# Local testing
firebase serve
```

**🔥 Your portfolio is now live at: https://about-jay-rathod.web.app**
