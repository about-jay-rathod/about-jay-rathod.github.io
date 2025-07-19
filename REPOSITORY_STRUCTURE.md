# 📁 **Repository Structure & Organization**

```
Jay Rathod Portfolio Website
├── 📄 README.md                    # Main documentation & setup guide
├── 📄 LICENSE                      # MIT License
├── 🔧 firebase.json                # Firebase configuration
├── 🔐 .gitignore                   # Security & file exclusions
├── 📊 DEPENDENCIES.md              # Dependency management guide
├──  COMMANDS_REFERENCE.md        # Complete npm & Firebase CLI guide
├── 🗂️ REPOSITORY_STRUCTURE.md      # This file - project organization
│
├── 📂 public/                      # Static website files (Firebase Hosting)
│   ├── 📄 index.html               # Main portfolio homepage
│   ├── 🖼️ favicon.png              # Website icon
│   ├── 📂 assets/                  # Static assets
│   │   ├── 📂 css/                 # Stylesheets
│   │   │   └── 📄 style.css        # Custom portfolio styles
│   │   ├── 📂 js/                  # Client-side JavaScript
│   │   │   └── 📄 main.js          # Core website functionality
│   │   ├── 📂 img/                 # Images & media
│   │   │   ├── 📷 profile.jpeg     # Jay's profile photo
│   │   │   ├── 📂 background/      # Background images
│   │   │   ├── 📂 certification/   # Certificate images
│   │   │   ├── 📂 education/       # Educational institution logos
│   │   │   └── 📂 project/         # Project screenshots
│   │   └── 📂 vendor/              # Third-party libraries
│   │       ├── 📂 bootstrap/       # Bootstrap CSS framework
│   │       ├── 📂 boxicons/        # Icon fonts
│   │       ├── 📂 jquery/          # jQuery library
│   │       └── 📂 [...others]      # Additional libraries
│   └── 📂 projects/                # Individual project showcase pages
│       ├── 📄 ecom.html            # E-commerce project
│       ├── 📄 ninf.html            # News platform project  
│       ├── 📄 pdd.html             # Parkinson's detection project
│       ├── 📄 rob.html             # Robotics project
│       └── 📄 empty_template.html  # Template for new projects
│
├── 📂 functions/                   # Firebase Functions (Backend)
│   ├── 📄 package.json             # Node.js dependencies & scripts
│   ├── 📄 portfolio-firebase-functions.js  # Main Functions file (RENAMED!)
│   ├── 🔐 .env                     # Environment variables (NOT in git)
│   ├── 📄 .env.template            # Template for environment setup
│   └── 📂 node_modules/            # Dependencies (NOT in git)
│
└── 🚫 [Hidden/Ignored Files]       # Protected by .gitignore
    ├── .firebase/                  # Firebase deployment cache
    ├── firebase-debug.log          # Firebase debug logs
    └── temporary.txt               # Temporary development files
```

---

## 🎯 **File Purposes & Responsibilities**

### **📄 Root Documentation Files**
| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Main setup, deployment & usage guide | Developers, Contributors |
| `DEPENDENCIES.md` | Package management & version tracking | Maintainers |
| `COMMANDS_REFERENCE.md` | Complete CLI command reference | Developers |
| `REPOSITORY_STRUCTURE.md` | Project organization guide | New contributors |

### **🔧 Configuration Files**
| File | Purpose | Security Level |
|------|---------|---------------|
| `firebase.json` | Firebase project configuration | ✅ Safe to commit |
| `.gitignore` | Repository security & file exclusions | ✅ Safe to commit |
| `functions/.env` | API keys & credentials | 🚨 NEVER commit |
| `functions/.env.template` | Environment variable template | ✅ Safe to commit |

### **📂 Directory Structure**

#### **`public/` - Frontend Website**
- **Purpose**: Static website files served by Firebase Hosting
- **Technology**: HTML5, CSS3, JavaScript, Bootstrap
- **Security**: No sensitive data, publicly accessible

#### **`functions/` - Backend API**
- **Purpose**: Server-side logic, AI processing, email handling
- **Technology**: Node.js 20, Firebase Functions, Gemini AI
- **Security**: Environment variables protected, server-side only

---

## 🔐 **Security Architecture**

### **Protected Files (Never Committed)**
```
🚨 HIGH RISK - Contains API Keys & Passwords
├── functions/.env                  # API keys, email credentials
├── .firebase/                     # Deployment secrets
├── firebase-debug.log            # May contain sensitive info
└── Any files matching:
    ├── *.key, *.pem, *.p12       # Certificate files
    ├── **/secrets/, **/keys/      # Secret directories
    ├── api-keys.js, credentials.js # Credential files
    └── serviceAccountKey.json     # Google Cloud keys
```

### **Safe Files (OK to Commit)**
```
✅ SAFE - No Sensitive Data
├── All documentation (*.md)       # Public information
├── firebase.json                  # Public configuration
├── public/**                      # Static website files
├── functions/package.json         # Dependency list only
├── .env.template                  # Template without real values
└── functions/portfolio-firebase-functions.js  # Code only
```

---

## 🏗️ **Development Workflow**

### **1. Local Development Setup**
```bash
# Clone repository
git clone <repository-url>
cd about-jay-rathod.github.io

# Setup environment variables
cp functions/.env.template functions/.env
# Edit functions/.env with your actual keys

# Install dependencies
cd functions && npm install

# Start development server
cd .. && firebase serve
```

### **2. File Organization Rules**

#### **✅ DO - Good Practices**
- Keep all documentation in root directory
- Use clear, descriptive file names
- Organize assets by type in `public/assets/`
- Keep functions code modular and well-documented
- Update documentation when adding features

#### **❌ DON'T - Security Risks**
- Never commit `.env` files
- Don't hardcode API keys in JavaScript files
- Avoid storing sensitive data in `public/` directory
- Don't commit `node_modules/` or `.firebase/`
- Never push temporary files with sensitive content

---

## 📊 **Project Statistics**

### **File Count by Type**
- **Documentation**: 4 files (.md)
- **Configuration**: 3 files (.json, .gitignore)
- **Frontend Code**: ~90 files (HTML, CSS, JS, assets)
- **Backend Code**: 2 files (.js, package.json)
- **Templates**: 1 file (.env.template)

### **Technology Stack**
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js 20, Firebase Functions
- **AI**: Google Gemini 2.0 Flash API
- **Email**: Nodemailer with Gmail SMTP
- **Hosting**: Firebase Hosting with global CDN
- **Database**: GitHub Gist (professional data storage)

---

## 🎯 **Contribution Guidelines**

### **Adding New Files**
1. Choose appropriate directory based on file type
2. Use clear, descriptive naming conventions
3. Update this structure document if needed
4. Ensure new files don't contain sensitive data
5. Add to `.gitignore` if file contains secrets

### **Modifying Structure**
1. Document changes in this file
2. Update README.md if setup process changes
3. Test deployment after structural changes
4. Communicate changes to all contributors

---

**Last Updated**: January 15, 2024  
**Next Review**: February 15, 2024  
**Maintained By**: Jay Rathod (jayrathod.ca@gmail.com)
