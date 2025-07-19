# 🚀 Jay Rathod Portfolio Website

A modern, responsive portfolio website with AI-powered chatbot and secure contact form functionality.

## 🌟 Features

### ✨ Core Functionality
- **Responsive Portfolio Website** - Modern Bootstrap-based design
- **AI-Powered Chatbot** - Interactive assistant using Google Gemini 2.0 Flash
- **Smart Contact Form** - Sends emails with AI-generated responses
- **Secure Architecture** - API keys protected with Firebase Functions
- **Single Source of Truth** - Professional data managed via GitHub Gist

### 🛡️ Security Features
- All API keys stored server-side in environment variables
- No sensitive data exposed in client-side code
- CORS protection and input validation
- Professional email sending with Gmail SMTP

## 🏗️ Architecture

```
📁 Portfolio Website
├── 📁 public/                 # Static website files (deployed to Firebase Hosting)
│   ├── 📁 assets/            # CSS, JS, images, vendor libraries
│   ├── 📁 projects/          # Individual project pages
│   └── index.html            # Main portfolio page
├── 📁 functions/             # Firebase Functions (server-side)
│   ├── index.js              # Main functions file
│   ├── package.json          # Node.js dependencies
│   └── .env                  # Environment variables (API keys)
├── firebase.json             # Firebase configuration
└── README.md                 # This file
```

## 🔧 Technical Stack

### Frontend
- **HTML5/CSS3** - Semantic markup and modern styling
- **Bootstrap 4** - Responsive grid system and components
- **JavaScript (ES6+)** - Modern vanilla JavaScript
- **jQuery** - DOM manipulation and animations

### Backend (Firebase Functions)
- **Node.js 20** - Latest LTS runtime
- **Firebase Functions** - Serverless cloud functions
- **Nodemailer** - Professional email sending
- **Google Gemini API** - AI-powered responses

### Third-Party Libraries
- **Owl Carousel** - Image galleries and testimonials
- **Isotope** - Portfolio filtering
- **Venobox** - Lightbox functionality
- **Counter Up** - Animated counters
- **Waypoints** - Scroll-triggered animations

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (version 20 or higher)
- Firebase CLI
- Gmail account with App Password
- Google Gemini API key

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/about-jay-rathod/about-jay-rathod.github.io.git
cd about-jay-rathod.github.io

# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Install Functions dependencies
cd functions
npm install
```

### 2. Environment Variables
Create `functions/.env` file with your API keys:

```env
# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail Configuration
EMAIL_PASS=your_gmail_app_password_here
EMAIL_USER=your_email@gmail.com
EMAIL_TO=your_email@gmail.com

# SMTP Settings
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### 3. Firebase Configuration
```bash
# Initialize Firebase project (if needed)
firebase init

# Select:
# - Functions: Configure a Cloud Functions directory
# - Hosting: Configure files for Firebase Hosting
```

## 🚀 Deployment

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

## 📧 **Enhanced Two-Way Email System**

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
